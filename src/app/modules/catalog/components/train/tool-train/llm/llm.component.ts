import {
    Component,
    ChangeDetectionStrategy,
    DestroyRef,
    OnInit,
    inject,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    LlmConfiguration,
    ModuleGeneralConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { LlmConfFormComponent } from '../../../conf-forms/llm-conf-form/llm-conf-form.component';
import { MatDivider } from '@angular/material/divider';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';

@Component({
    selector: 'app-llm',
    templateUrl: './llm.component.html',
    styleUrls: ['./llm.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        LlmConfFormComponent,
        MatDivider,
    ],
})
export class LlmComponent implements OnInit {
    private readonly toolsService = inject(ToolsService);
    private readonly deploymentsService = inject(DeploymentsService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly snackbarService = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Model id preselected when navigating here from the catalog
     * (e.g. "Deploy this model" on an LLM card). Passed down to
     * app-general-conf-form.
     */
    readonly modelId: string | undefined =
        this.router.lastSuccessfulNavigation()?.extras?.state?.['llmId'];

    title = '';
    readonly step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';

    showHelp = false;
    showLoader = false;
    /** Covers the already-rendered form with an overlay (doesn't unmount it). */
    llmFieldsLoading = false;

    readonly generalConfForm: FormGroup = this.formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    llmConfDefaultValues!: LlmConfiguration;

    readonly showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: false,
        dockerTagSelect: false,
        infoButton: true,
        co2EmissionsInput: false,
        cvatFields: false,
        ai4lifeFields: false,
        batchFields: false,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    private loadModule(): void {
        const parentParams = this.route.parent?.params;
        if (!parentParams) {
            return;
        }

        parentParams
            .pipe(
                switchMap((params) => {
                    this.showLoader = true;
                    const toolId = params['id'];
                    return forkJoin({
                        tool: this.toolsService.getTool(toolId),
                        toolConfiguration:
                            this.toolsService.getVllmConfiguration(toolId),
                    });
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: ({ tool, toolConfiguration }) => {
                    this.title = tool.title;
                    this.generalConfDefaultValues = toolConfiguration.general;
                    this.llmConfDefaultValues = toolConfiguration.llm;
                    this.showLoader = false;
                },
                error: () => {
                    this.snackbarService.openError(
                        "Couldn't load the LLM configuration. Please try again later."
                    );
                    this.showLoader = false;
                },
            });
    }

    showHelpButtonChange(checked: boolean): void {
        this.showHelp = checked;
    }

    onLlmLoadingChange(isLoading: boolean): void {
        this.llmFieldsLoading = isLoading;
    }

    @ViewChild(LlmConfFormComponent) llmConfFormCmp!: LlmConfFormComponent;
    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;

    private handleSuccess(result: StatusReturn): void {
        this.showLoader = false;

        if (result?.status === 'success') {
            this.router.navigate(['/tasks/deployments']).then((navigated) => {
                if (navigated) {
                    this.snackbarService.openSuccess(
                        'Deployment created with ID ' + result.job_ID
                    );
                }
            });
        } else if (result?.status === 'fail') {
            this.snackbarService.openError(
                'Error while creating the deployment ' + result.error_msg
            );
        }
    }

    onSubmit(): void {
        this.showLoader = true;

        const request: TrainModuleRequest = {
            general: this.generalConfFormCmp.getPayload(),
            llm: this.llmConfFormCmp.getPayload(),
        };

        this.deploymentsService.trainTool('ai4os-llm', request).subscribe({
            next: (result) => this.handleSuccess(result),
            error: () => (this.showLoader = false),
        });
    }
}

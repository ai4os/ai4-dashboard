import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    FederatedServerConfiguration,
    FederatedServerToolConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
} from '@app/shared/interfaces/module.interface';
import {
    ShowHardwareField,
    HardwareConfFormComponent,
} from '../../hardware-conf-form/hardware-conf-form.component';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../general-conf-form/general-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { FederatedConfFormComponent } from './federated-conf-form/federated-conf-form.component';

@Component({
    selector: 'app-federated-server',
    templateUrl: './federated-server.component.html',
    styleUrls: ['./federated-server.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        FederatedConfFormComponent,
    ],
})
export class FederatedServerComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    toolsService = inject(ToolsService);

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'CATALOG.MODULE-TRAIN.FLOWER-CONF';

    showHelp = false;
    showLoader = false;
    warningMessage = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    federatedConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    federatedConfDefaultValues!: FederatedServerConfiguration;

    showHardwareFields: ShowHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
    };

    showGeneralFields: ShowGeneralFormField = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        co2EmissionsInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: true,
        cvatFields: false,
        ai4lifeFields: false,
        batchFields: false,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService
                .getTool(params['id'])
                .subscribe((federatedServer) => {
                    this.title = federatedServer.title;
                });
            this.toolsService
                .getFederatedServerConfiguration(params['id'])
                .subscribe((moduleConf: FederatedServerToolConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    this.federatedConfDefaultValues = moduleConf.flower;

                    // Check if config has a warning
                    if (
                        this.hardwareConfDefaultValues.warning &&
                        this.hardwareConfDefaultValues.warning !== ''
                    ) {
                        this.warningMessage =
                            this.hardwareConfDefaultValues.warning;
                    }
                });
        });
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }
}

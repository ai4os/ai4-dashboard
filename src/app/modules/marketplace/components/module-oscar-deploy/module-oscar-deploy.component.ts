import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { ModulesService } from '@modules/marketplace/services/modules-service/modules.service';

@Component({
    selector: 'app-module-oscar-deploy',
    templateUrl: './module-oscar-deploy.component.html',
    styleUrls: ['./module-oscar-deploy.component.scss'],
})
export class ModuleOscarDeployComponent implements OnInit, AfterViewInit {
    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private router: Router
    ) {}

    @ViewChild('showHelpToggle', { read: ElementRef }) element:
        | ElementRef
        | undefined;

    defaultServiceConfig: Service = {
        image: '',
        name: '',
        script: '',
        labels: {},
        environment: { Variables: {} },
        memory: '',
        cpu: '',
        total_cpu: '',
        total_memory: '',
        log_level: '',
        enable_gpu: false,
    };

    overview: any;
    moduleTitle = '';
    dockerImageName = '';
    oscar_endpoint = '';
    showProgress = false;
    serviceRequest: Service = this.defaultServiceConfig;

    generalConfigForm: FormGroup = this._formBuilder.group({});
    computeConfigForm: FormGroup = this._formBuilder.group({});
    showHelpForm: FormGroup = this._formBuilder.group({
        showHelpToggleButton: false,
    });

    generalConfigDefaultValues: Service = this.defaultServiceConfig;
    computeConfigDefaultValues: Service = this.defaultServiceConfig;

    ngOnInit(): void {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.moduleTitle = module.title;
            });

            this.modulesService
                .getModuleConfiguration(params['id'])
                .subscribe((moduleConf: any) => {
                    this.dockerImageName =
                        moduleConf.general.docker_image.value;

                    this.generalConfigDefaultValues = {
                        ...this.generalConfigDefaultValues,
                        image: this.dockerImageName,
                    };
                });
        });
    }

    submitCreateService() {
        console.log('Request', this.serviceRequest);

        this.showProgress = true;
        this.modulesService
            .createService(this.oscar_endpoint, this.serviceRequest)
            .then((res: any) => {
                this.router
                    .navigate(['../'], { relativeTo: this.route })
                    .then((navigated: boolean) => {
                        if (navigated) {
                            this.snackbarService.openSuccess(
                                'Service ' +
                                    res.name.toUpperCase() +
                                    ' successfully created'
                            );
                        }
                    });
            })
            .catch((error) => {
                this.snackbarService.openError(
                    'ERROR creating service: ' + error
                );
            });
    }

    createServiceRequest() {
        const { oscarUri } =
            this.generalConfigForm.getRawValue().generalConfigForm;
        this.oscar_endpoint = oscarUri;

        const {
            serviceNameInput,
            dockerImageInput,
            script,
            labelItems,
            environmentVariables,
        } = this.generalConfigForm.getRawValue().generalConfigForm;

        const {
            cpuInput,
            cpuTotalInput,
            memoryInput,
            memoryTotalInput,
            enableGpu,
            logLevel,
        } = this.computeConfigForm.getRawValue().computeConfigForm;

        const request: Service = {
            name: serviceNameInput,
            script: script,
            image: dockerImageInput,
            labels: this.parseLabels(labelItems),
            environment: this.parseEnvironmentVariables(environmentVariables),
            cpu: cpuInput.toString(),
            total_cpu: cpuTotalInput.toString(),
            memory: memoryInput + 'Mi',
            total_memory: memoryTotalInput + 'Mi',
            enable_gpu: enableGpu,
            log_level: logLevel,
        };

        this.serviceRequest = { ...request };
    }

    parseLabels(labelsItems: []) {
        return labelsItems.reduce((obj: any, item: any) => {
            obj[item.keyInput] = item.valueInput;
            return obj;
        }, {});
    }

    parseEnvironmentVariables(environmentVariables: []) {
        return {
            Variables: environmentVariables.reduce((obj: any, item: any) => {
                obj[item.keyInput] = item.valueInput;
                return obj;
            }, {}),
        };
    }

    setIcon() {
        const help =
            'M12.094 17.461q.375 0 .633-.258t.258-.633q0-.375-.258-.633t-.633-.258q-.375 0-.633.258t-.258.633q0 .375.258 .633t.633.258Zm-.82-3.422h1.383q0-.609.152-1.113T13.758 11.766q.727-.609 1.031-1.195t.305-1.289q0-1.242-.809-1.992T12.141 6.539q-1.148 0-2.027.574T8.836 8.695l1.242.469q.258-.656.773-1.02t1.219-.363q.797 0 1.289.434t.492 1.113q0 .516-.305.973T12.656 11.25q-.703.609-1.043 1.207T11.273 14.039Zm.727 7.336q-1.922 0-3.633-.738t-2.988-2.016Q4.102 17.344 3.363 15.633T2.625 12q0-1.945.738-3.656t2.016-2.977Q6.656 4.102 8.367 3.363T12 2.625q1.945 0 3.656.738T18.633 5.367q1.266 1.266 2.004 2.977T21.375 12q0 1.922-.738 3.633T18.633 18.621q-1.266 1.277-2.977 2.016T12 21.375Zm0-1.406q3.328 0 5.648-2.332T19.969 12q0-3.328-2.32-5.648t-5.648-2.32q-3.305 0-5.637 2.32T4.031 12q0 3.305 2.332 5.637T12 19.969Zm0-7.969Z';

        if (this.element) {
            this.element.nativeElement
                .querySelector('.mdc-switch__icon--on')
                .firstChild.setAttribute('d', help);
            this.element.nativeElement
                .querySelector('.mdc-switch__icon--off')
                .firstChild.setAttribute('d', help);
        }
    }

    ngAfterViewInit(): void {
        this.setIcon();
    }
}

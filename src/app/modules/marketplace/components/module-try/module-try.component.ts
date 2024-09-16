import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '@modules/marketplace/services/modules-service/modules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
    ModuleConfiguration,
    Service,
} from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

interface PredictionResultItem {
    label: string;
    probability: number;
    label_info: string;
    info: string | undefined;
    images: string | undefined;
}

@Component({
    selector: 'app-module-try',
    templateUrl: './module-try.component.html',
    styleUrls: ['./module-try.component.scss'],
})
export class ModuleTryComponent implements OnInit, AfterViewInit {
    @ViewChild('showHelpToggle', { read: ElementRef }) element:
        | ElementRef
        | undefined;

    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        public dialog: MatDialog
    ) {}

    oscar_endpoint = '';
    imageUrl = '';
    videoUrl = '';
    audioUrl = '';
    fileContent = '';

    deploymentTitle = '';
    dockerImageName: string | number | boolean = '';
    fileName = '';
    currentFile?: File;
    predictionData: Array<PredictionResultItem> = [];
    showProgress = false;
    showPrediction = false;
    showTable = false;
    servicesNames: Array<string> = [];
    serviceList: Array<Service> = [];
    displayedColumns: string[] = ['label', 'probability', 'images', 'info'];
    showHelpForm: FormGroup = this._formBuilder.group({
        showHelpToggleButton: false,
    });

    trymeFormGroup: FormGroup = this._formBuilder.group({
        dockerImageInput: [{ value: '', disabled: true }],
        serviceNameInput: ['', Validators.required],
        inputFile: [''],
        inputText: [''],
    });

    ngOnInit(): void {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.deploymentTitle = module.title;
            });

            this.modulesService
                .getModuleConfiguration(params['id'])
                .subscribe((moduleConf: ModuleConfiguration) => {
                    const moduleGeneral = moduleConf.general;
                    this.dockerImageName = moduleGeneral.docker_image.value;
                    this.trymeFormGroup
                        .get('dockerImageInput')
                        ?.setValue(this.dockerImageName);
                });
        });
    }

    /**
     * On change event that populates the required file value
     * @param event event
     */
    selectFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];
            this.currentFile = file;
            this.fileName = file.name;

            if (this.currentFile != null) {
                //this.trymeFormGroup.get('inputFile')?.setValue(this.currentFile);
            }
        } else {
            this.currentFile = undefined;
            this.fileName = 'Select File';
        }
    }

    /**
     * Populates the array which has the services that load in the template dropdown.
     */
    async loadServices() {
        this.modulesService
            .getServices(this.oscar_endpoint)
            .then((services) => {
                this.enableInputFields();
                this.serviceList = services;
                this.servicesNames = this.serviceList
                    .filter((service) => service.image == this.dockerImageName)
                    .map((service) => service.name);

                if (this.servicesNames.length <= 0) {
                    this.servicesNames.push('NO OPTIONS');
                }
                this.setIcon();
            })
            .catch((error) => {
                this.snackbarService.openError('Invalid url:  ' + error);
            });
    }

    onBlur() {
        this.serviceList = [];
        this.servicesNames = [];
        this.loadServices();
    }

    disableInputFieds() {
        this.trymeFormGroup.get('inputFile')?.disable();
        this.trymeFormGroup.get('inputText')?.disable();
        this.trymeFormGroup.get('serviceNameInput')?.disable();
    }

    enableInputFields() {
        this.trymeFormGroup.get('inputFile')?.enable();
        this.trymeFormGroup.get('inputText')?.enable();
        this.trymeFormGroup.get('serviceNameInput')?.enable();
    }

    /**
     * Run existing service sending file and service name.
     */
    launchModel(): void {
        this.showProgress = true;
        const serviceName =
            this.trymeFormGroup.controls['serviceNameInput'].value;
        if (this.currentFile) {
            this.runService(this.oscar_endpoint, serviceName, this.currentFile);
        }
    }

    async runService(oscar_endpoint: string, serviceName: string, file: File) {
        try {
            const stringBase64 = await this.encodeFileToBase64(file);
            const response = await this.modulesService.runService(
                oscar_endpoint,
                serviceName,
                stringBase64
            );
            const { mime, data } = response;
            console.log('MIME TYPE', mime);

            switch (mime) {
            case 'application/zip':
                this.handleZip(data);
                break;
            case 'image/png':
            case 'image/gif':
            case 'image/jpeg':
                this.handleImage(mime, data);
                break;
            case 'audio/wav':
            case 'audio/mpeg':
                this.handleAudio(mime, data);
                break;
            case 'video/mp4':
                this.handleVideo(mime, data);
                break;
            case 'application/octet-stream':
                this.handleJson(data);
                break;
            default:
                console.error('MIME TYPE NOT FOUND', mime);
                break;
            }
        } catch (error) {
            console.error('Error ocurred executing service!!', error);
        }
    }

    handleZip(data: string) {
        this.fileContent = data;
        this.showPrediction = true;
        this.showProgress = false;
    }

    handleImage(mime: string, data: string) {
        this.imageUrl = `data:${mime};base64,${data}`;
        this.showPrediction = true;
        this.showProgress = false;
    }

    handleAudio(mime: string, data: string) {
        this.audioUrl = `data:${mime};base64,${data}`;
        this.showPrediction = true;
        this.showProgress = false;
    }

    handleVideo(mime: string, data: string) {
        this.videoUrl = `data:${mime};base64,${data}`;
        this.showPrediction = true;
        this.showProgress = false;
    }

    handleJson(data: string) {
        try {
            const decodedData = atob(data);
            const jsonData = JSON.parse(decodedData.replace(/'/g, '"'));
            this.setPredictionData(jsonData);
        } catch (error) {
            console.error('Error parsing JSON:', error + ' ' + data);
        }
    }

    setPredictionData(data: any) {
        // Get the first element of the array.
        if (Array.isArray(data)) {
            data = data[0];
        }

        // If the data is an object, then use it.
        if (typeof data !== 'object') {
            console.error('Invalid data format for prediction.');
            return;
        }

        if (
            !data.labels ||
            !data.probabilities ||
            !data.labels_info ||
            !data.links
        ) {
            console.error('Data structure is incomplete for prediction.');
            return;
        }

        for (let i = 0; i < data.labels.length; i++) {
            this.predictionData.push({
                label: data.labels[i],
                probability: data.probabilities[i],
                label_info: data.labels_info[i],
                info: data.links['Wikipedia'][i],
                images: data.links['Google Images'][i],
            });
        }
        this.showTable = true;
        this.showPrediction = true;
        this.showProgress = false;
        console.log('Prediction Data ', JSON.stringify(this.predictionData));
    }

    downloadZip(): void {
        const url = 'data:text/zip;base64,' + this.fileContent;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inference-result.zip';
        link.click();

        window.URL.revokeObjectURL(url);
        link.remove();
    }

    async encodeFileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(',')[1]);
            };

            reader.onerror = () => {
                reject(new Error('Error al leer el archivo.'));
            };

            reader.readAsDataURL(file);
        });
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

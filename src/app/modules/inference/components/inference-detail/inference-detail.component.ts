import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { OscarInferenceService } from '../../services/oscar-inference.service';

export interface SecretField {
    value: string;
    hide: boolean;
}

@Component({
    selector: 'app-inference-detail',
    templateUrl: './inference-detail.component.html',
    styleUrls: ['./inference-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class InferenceDetailComponent implements OnInit {
    data = inject<{
        name: string;
    }>(MAT_DIALOG_DATA);

    dialogRef = inject(MatDialogRef<InferenceDetailComponent>);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    oscarInferenceService = inject(OscarInferenceService);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    isLoading = false;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    service: OscarService | undefined;

    tokenField: SecretField = {
        value: '',
        hide: true,
    };

    accessKeyField: SecretField = {
        value: '',
        hide: true,
    };

    minioSecretField: SecretField = {
        value: '',
        hide: true,
    };

    ngOnInit(): void {
        this.getService();
    }

    getService() {
        this.isLoading = true;
        this.oscarInferenceService.getServiceByName(this.data.name).subscribe({
            next: (service: OscarService) => {
                this.service = service;
                this.service.title = service.environment.variables.PAPI_TITLE;
                this.service.description =
                    service.environment.variables.PAPI_DESCRIPTION ?? '';
                this.service.submit_time =
                    service.environment.variables.PAPI_CREATED;
                this.tokenField.value = service.token;
                this.accessKeyField.value =
                    service.storage_providers.minio.default.access_key;
                this.minioSecretField.value =
                    service.storage_providers.minio.default.secret_key;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.dialogRef.close();
            },
        });
    }

    openDocumentationWeb(): void {
        const url = 'https://docs.ai4os.eu/en/latest/howtos/deploy/oscar.html';
        window.open(url);
    }
}

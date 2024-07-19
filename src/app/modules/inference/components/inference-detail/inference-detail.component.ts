import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
})
export class InferenceDetailComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<InferenceDetailComponent>,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public oscarInferenceService: OscarInferenceService,
        @Inject(MAT_DIALOG_DATA)
        public data: { name: string }
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    isLoading = false;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    service: OscarService | undefined;
    secretField: SecretField = {
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
                this.secretField.value = service.token;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.dialogRef.close();
            },
        });
    }
}

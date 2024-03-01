import {
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { Secret } from '@app/shared/interfaces/module.interface';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export interface SecretField {
    name: string;
    value: string;
    hide: boolean;
}

@Component({
    selector: 'app-secret-management-detail',
    templateUrl: './secret-management-detail.component.html',
    styleUrls: ['./secret-management-detail.component.scss'],
})
export class SecretManagementDetailComponent implements OnInit {
    constructor(
        private readonly injector: Injector,
        private secretsService: SecretsService,
        public confirmationDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { uuid: string; name: string },
        private _snackBar: MatSnackBar,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    secrets: SecretField[] = [];
    paginatedSecrets: SecretField[] = [];
    newSecretFormControl = new FormControl('');

    isLoading = false;
    translateService!: TranslateService;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    pageEvent: PageEvent | undefined;
    length = 20;
    pageSize = 0;
    pageIndex = 0;

    ngOnInit(): void {
        this.pageSize = this.mobileQuery.matches ? 3 : 5;
        if (this.data.uuid) {
            this.getSecrets();
        }
        this.translateService = this.injector.get(TranslateService);
    }

    getSecrets() {
        this.isLoading = true;
        const subpath = '/deployments/' + this.data.uuid + '/federated/';
        this.secrets = [];

        this.secretsService.getSecrets(subpath).subscribe((secrets) => {
            for (let i = 0; i < Object.values(secrets).length; i++) {
                const secret: SecretField = {
                    name: Object.keys(secrets)[i].substring(
                        Object.keys(secrets)[i].lastIndexOf('/') + 1
                    ),
                    value: Object.values(secrets)[i].token,
                    hide: true,
                };
                this.secrets.push(secret);
            }
            this.paginatedSecrets = this.secrets.slice(0, this.pageSize);
            this.length = this.secrets.length;
            this.isLoading = false;
        });
    }

    addSecret(name: string) {
        this.isLoading = true;
        const secretPath =
            '/deployments/' + this.data.uuid + '/federated/' + name;
        const secret: Secret = { token: 'None' };

        if (this.secretNameValid(name)) {
            this.secretsService.createSecret(secret, secretPath).subscribe({
                next: () => {
                    this.getSecrets();
                    this._snackBar.open(
                        'Successfully created secret with name: ' + name,
                        'X',
                        {
                            duration: 3000,
                            panelClass: ['primary-snackbar'],
                        }
                    );
                },
                error: () => {
                    this.isLoading = false;
                    this._snackBar.open(
                        'Error creating secret with name: ' + name,
                        'X',
                        {
                            duration: 3000,
                            panelClass: ['red-snackbar'],
                        }
                    );
                },
                complete: () => {
                    this.newSecretFormControl.setValue('');
                },
            });
        }
    }

    deleteSecret(name: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data:
                    this.secrets.length == 1
                        ? this.translateService.instant(
                            'DEPLOYMENTS.DEPLOYMENT-SECRETS.DELETE-LAST-SECRET'
                        )
                        : this.translateService.instant(
                            'DEPLOYMENTS.DEPLOYMENT-SECRETS.DELETE'
                        ),
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    this.secrets = this.secrets.filter((s) => s.name !== name);

                    const pageEvent: PageEvent = {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        length: this.secrets.length,
                    };
                    this.handlePageEvent(pageEvent);

                    const secretPath =
                        '/deployments/' + this.data.uuid + '/federated/' + name;
                    this.secretsService.deleteSecret(secretPath).subscribe({
                        next: () => {
                            this.isLoading = false;
                            this._snackBar.open(
                                'Successfully deleted secret with name: ' +
                                    name,
                                'X',
                                {
                                    duration: 3000,
                                    panelClass: ['primary-snackbar'],
                                }
                            );
                        },
                        error: () => {
                            this.isLoading = false;
                            this._snackBar.open(
                                'Error deleting secret with name: ' + name,
                                'X',
                                {
                                    duration: 3000,
                                    panelClass: ['red-snackbar'],
                                }
                            );
                        },
                        complete: () => {
                            this.isLoading = false;
                        },
                    });
                }
            });
    }

    secretNameValid(name: string): boolean {
        if (this.secrets.find((s) => s.name === name) || name === '') {
            return false;
        }
        return true;
    }

    handlePageEvent(e: PageEvent) {
        this.length = this.secrets.length;
        const firstCut = e.pageIndex * e.pageSize;
        const secondCut = firstCut + e.pageSize;
        this.paginatedSecrets = this.secrets.slice(firstCut, secondCut);
    }
}

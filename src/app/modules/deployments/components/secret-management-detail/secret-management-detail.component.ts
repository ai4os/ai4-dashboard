import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { Secret } from '@app/shared/interfaces/module.interface';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

export interface SecretField {
    name: string;
    value: string;
    hide: boolean;
    erasable?: boolean;
}

@Component({
    selector: 'app-secret-management-detail',
    templateUrl: './secret-management-detail.component.html',
    styleUrls: ['./secret-management-detail.component.scss'],
})
export class SecretManagementDetailComponent implements OnInit {
    constructor(
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
    }

    getSecrets() {
        this.isLoading = true;
        let subpath = '/deployments/' + this.data.uuid + '/federated/';
        this.secrets = [];

        this.secretsService.getSecrets(subpath).subscribe((secrets) => {
            for (let i = 0; i < Object.values(secrets).length; i++) {
                let secret: SecretField = {
                    name: Object.keys(secrets)[i].substring(
                        Object.keys(secrets)[i].lastIndexOf('/') + 1
                    ),
                    value: Object.values(secrets)[i].token,
                    hide: true,
                    erasable: Object.values(secrets)[i].erasable ?? true,
                };
                this.secrets.push(secret);
            }
            // non-erasable field always appears on top
            this.secrets.sort((s) => (s.erasable ? 1 : -1));
            this.paginatedSecrets = this.secrets.slice(0, this.pageSize);
            this.length = this.secrets.length;
            this.isLoading = false;
        });
    }

    addSecret(name: string, erasable?: boolean) {
        this.isLoading = true;
        let secretPath =
            '/deployments/' + this.data.uuid + '/federated/' + name;
        let secret: Secret = { token: 'None' };

        if (erasable === false) {
            secret.erasable = false;
        }

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
                data: `Are you sure you want to delete this secret?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    this.secrets = this.secrets.filter((s) => s.name !== name);

                    let pageEvent: PageEvent = {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        length: this.secrets.length,
                    };
                    this.handlePageEvent(pageEvent);

                    let secretPath =
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

    regenerateSecret(name: string) {
        this.isLoading = true;
        this.secrets = this.secrets.filter((s) => s.name !== name);
        let secretPath =
            '/deployments/' + this.data.uuid + '/federated/' + name;
        this.secretsService.deleteSecret(secretPath).subscribe({
            next: () => {
                let secretPath =
                    '/deployments/' + this.data.uuid + '/federated/' + name;
                let secret: Secret = { token: 'None', erasable: false };
                this.secretsService
                    .createSecret(secret, secretPath)
                    .subscribe(() => this.getSecrets());
            },
            error: () => {
                this.isLoading = false;
                this._snackBar.open(
                    'Error regenerating secret with name: ' + name,
                    'X',
                    {
                        duration: 3000,
                        panelClass: ['red-snackbar'],
                    }
                );
            },
            complete: () => {
                this._snackBar.open(
                    'Successfully regenerated secret with name: ' + name,
                    'X',
                    {
                        duration: 3000,
                        panelClass: ['primary-snackbar'],
                    }
                );
            },
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
        let firstCut = e.pageIndex * e.pageSize;
        let secondCut = firstCut + e.pageSize;
        this.paginatedSecrets = this.secrets.slice(firstCut, secondCut);
    }
}

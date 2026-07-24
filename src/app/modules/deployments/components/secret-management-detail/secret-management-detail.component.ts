import {
    ChangeDetectorRef,
    Component,
    Injector,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogClose,
} from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { Secret } from '@app/shared/interfaces/module.interface';
import {
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import cryptoRandomString from 'crypto-random-string';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import {
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatError,
    MatHint,
} from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CopyToClipboardDirective } from '../../../../shared/directives/copy-to-clipboard.directive';

export interface SecretField {
    name: string;
    value: string;
    hide: boolean;
}

@Component({
    selector: 'app-secret-management-detail',
    templateUrl: './secret-management-detail.component.html',
    styleUrls: ['./secret-management-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        MatIcon,
        MatCard,
        MatProgressSpinner,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        NgClass,
        MatFormField,
        MatLabel,
        MatInput,
        MatIconButton,
        MatSuffix,
        MatTooltip,
        CopyToClipboardDirective,
        MatPaginator,
        FormsModule,
        ReactiveFormsModule,
        MatError,
        MatHint,
        MatButton,
        MatCardActions,
        MatDialogClose,
        TranslatePipe,
    ],
})
export class SecretManagementDetailComponent implements OnInit {
    data = inject<{
        uuid: string;
        name: string;
    }>(MAT_DIALOG_DATA);

    secretsService = inject(SecretsService);
    dialog = inject(MatDialog);
    injector = inject(Injector);
    translateService = inject(TranslateService);
    snackbarService = inject(SnackbarService);
    confirmationDialog = inject(MatDialog);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    fb = inject(FormBuilder);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    secrets: SecretField[] = [];
    paginatedSecrets: SecretField[] = [];
    secretFormGroup = this.fb.group({
        secret: ['', [Validators.required]],
    });

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
        const subpath = '/deployments/' + this.data.uuid + '/federated/';
        this.secrets = [];

        this.secretsService.getSecrets(subpath).subscribe({
            next: (secrets) => {
                for (let i = 0; i < Object.values(secrets).length; i++) {
                    const secret: SecretField = {
                        name: Object.keys(secrets)[i].substring(
                            Object.keys(secrets)[i].lastIndexOf('/') + 1
                        ),
                        value: Object.values(secrets)[i].token!,
                        hide: true,
                    };
                    this.secrets.push(secret);
                }
                this.paginatedSecrets = this.secrets.slice(0, this.pageSize);
                this.length = this.secrets.length;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }

    addSecret() {
        this.isLoading = true;
        const name = this.secretFormGroup.get('secret')?.getRawValue().trim();
        const secretPath =
            '/deployments/' + this.data.uuid + '/federated/' + name;
        const secret: Secret = { token: cryptoRandomString({ length: 64 }) };
        if (
            this.secretNameIsUnique() &&
            this.secretNameIsNotJustWhitespaces()
        ) {
            this.secretsService.createSecret(secret, secretPath).subscribe({
                next: () => {
                    this.secretFormGroup.markAsUntouched();
                    this.secrets.push({
                        name: name,
                        value: secret.token!,
                        hide: true,
                    });
                    this.secrets.sort((a, b) => a.name.localeCompare(b.name));
                    this.paginatedSecrets = this.secrets.slice(
                        0,
                        this.pageSize
                    );
                    this.length = this.secrets.length;
                    this.isLoading = false;

                    this.snackbarService.openSuccess(
                        'Successfully created secret with name: ' + name
                    );
                },
                error: () => {
                    this.isLoading = false;
                    this.snackbarService.openError(
                        'Error creating secret with name: ' + name
                    );
                },
                complete: () => {
                    this.secretFormGroup.get('secret')?.setValue('');
                },
            });
        }
    }

    deleteSecret(name: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title:
                        this.secrets.length == 1
                            ? this.translateService.instant(
                                  'DEPLOYMENTS.DEPLOYMENT-SECRETS.DELETE-LAST-SECRET'
                              )
                            : this.translateService.instant(
                                  'DEPLOYMENTS.DEPLOYMENT-SECRETS.DELETE'
                              ),
                } as ConfirmationDialogData,

                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    const secretPath =
                        '/deployments/' + this.data.uuid + '/federated/' + name;
                    this.secretsService.deleteSecret(secretPath).subscribe({
                        next: () => {
                            this.secrets = this.secrets.filter(
                                (s) => s.name !== name
                            );
                            this.secretFormGroup.markAsUntouched();
                            const pageEvent: PageEvent = {
                                pageIndex: this.pageIndex,
                                pageSize: this.pageSize,
                                length: this.secrets.length,
                            };
                            this.handlePageEvent(pageEvent);
                            this.isLoading = false;
                            this.snackbarService.openSuccess(
                                'Successfully deleted secret with name: ' + name
                            );
                        },
                        error: () => {
                            this.isLoading = false;
                            this.snackbarService.openError(
                                'Error deleting secret with name: ' + name
                            );
                        },
                        complete: () => {
                            this.isLoading = false;
                        },
                    });
                }
            });
    }

    secretNameIsUnique(): boolean {
        const name = this.secretFormGroup.get('secret')?.getRawValue().trim();
        return !this.secrets.some((s) => s.name === name);
    }

    secretNameIsNotJustWhitespaces(): boolean {
        const name = this.secretFormGroup.get('secret')?.getRawValue().trim();
        return name.length > 0;
    }

    handlePageEvent(e: PageEvent) {
        this.length = this.secrets.length;
        const firstCut = e.pageIndex * e.pageSize;
        const secondCut = firstCut + e.pageSize;
        this.paginatedSecrets = this.secrets.slice(firstCut, secondCut);
    }
}

import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import cryptoRandomString from 'crypto-random-string';
import { finalize } from 'rxjs';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Secret } from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { UiCredentialRowComponent } from '@app/shared/components/ui/ui-credential-row/ui-credential-row.component';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';

export interface SecretField {
    name: string;
    value: string;
}

@Component({
    selector: 'app-deployment-secrets',
    templateUrl: './deployment-secrets.component.html',
    styleUrls: ['./deployment-secrets.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MatPaginator,
        TranslatePipe,
        MatTooltip,
        UiButtonComponent,
        UiTextFieldComponent,
        UiLoaderComponent,
        UiCredentialRowComponent,
        MatDivider,
    ],
})
export class DeploymentSecretsComponent implements OnInit {
    @Input() uuid = '';

    private readonly secretsService = inject(SecretsService);
    private readonly confirmationDialog = inject(MatDialog);
    private readonly translateService = inject(TranslateService);
    private readonly snackbarService = inject(SnackbarService);
    private readonly media = inject(MediaMatcher);
    private readonly fb = inject(FormBuilder);

    secrets: SecretField[] = [];
    paginatedSecrets: SecretField[] = [];
    isLoading = false;

    pageSize = 5;
    pageIndex = 0;

    secretNameErrorMessages = {
        required: 'DEPLOYMENTS.SECRETS.REQUIRED-FIELD-ERROR',
        whitespaces: 'DEPLOYMENTS.SECRETS.WHITESPACES-ERROR',
        notUnique: 'DEPLOYMENTS.SECRETS.UNIQUE-NAME-ERROR',
    };

    private readonly notBlankValidator: ValidatorFn = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const value: string = control.value ?? '';
        return value.length > 0 && value.trim().length === 0
            ? { whitespaces: true }
            : null;
    };

    private readonly uniqueNameValidator: ValidatorFn = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const name: string = (control.value ?? '').trim();
        return this.secrets.some((s) => s.name === name)
            ? { notUnique: true }
            : null;
    };

    secretFormGroup = this.fb.group({
        secret: [
            '',
            [
                Validators.required,
                this.notBlankValidator,
                this.uniqueNameValidator,
            ],
        ],
    });

    ngOnInit(): void {
        this.pageSize = this.media.matchMedia('(max-width: 650px)').matches
            ? 3
            : 5;
        if (this.uuid) {
            this.getSecrets();
        }
    }

    private get basePath(): string {
        return '/deployments/' + this.uuid + '/federated/';
    }

    getSecrets(): void {
        this.isLoading = true;

        this.secretsService
            .getSecrets(this.basePath)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (secrets) => {
                    this.secrets = Object.entries(secrets)
                        .map(([path, secret]) => ({
                            name: path.substring(path.lastIndexOf('/') + 1),
                            value: secret.token ?? '',
                        }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                    this.secretFormGroup
                        .get('secret')
                        ?.updateValueAndValidity();
                    this.refreshPage();
                },
            });
    }

    addSecret(): void {
        if (this.secretFormGroup.invalid || this.isLoading) {
            this.secretFormGroup.markAllAsTouched();
            return;
        }

        const name: string = this.secretFormGroup
            .get('secret')!
            .getRawValue()
            .trim();
        const secret: Secret = { token: cryptoRandomString({ length: 64 }) };

        this.isLoading = true;
        this.secretsService
            .createSecret(secret, this.basePath + name)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: () => {
                    this.secrets = [
                        ...this.secrets,
                        { name, value: secret.token! },
                    ].sort((a, b) => a.name.localeCompare(b.name));

                    this.pageIndex = Math.floor(
                        this.secrets.findIndex((s) => s.name === name) /
                            this.pageSize
                    );
                    this.refreshPage();
                    this.secretFormGroup.reset({ secret: '' });

                    this.snackbarService.openSuccess(
                        'Successfully created secret with name: ' + name
                    );
                },
                error: () => {
                    this.snackbarService.openError(
                        'Error creating secret with name: ' + name
                    );
                },
            });
    }

    deleteSecret(name: string): void {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'DEPLOYMENTS.SECRETS.DELETE.TITLE',
                    subtitlePrefix:
                        'DEPLOYMENTS.SECRETS.DELETE.SUBTITLE-PREFIX',
                    subtitleHighlight: name,
                    subtitleSuffix: this.translateService.instant(
                        this.secrets.length === 1
                            ? 'DEPLOYMENTS.SECRETS.DELETE.SUBTITLE-SUFFIX-LAST-SECRET'
                            : 'DEPLOYMENTS.SECRETS.DELETE.SUBTITLE-SUFFIX'
                    ),
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'DEPLOYMENTS.SECRETS.DELETE.REVOKE',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (!confirmed) return;

                this.isLoading = true;
                this.secretsService
                    .deleteSecret(this.basePath + name)
                    .pipe(finalize(() => (this.isLoading = false)))
                    .subscribe({
                        next: () => {
                            this.secrets = this.secrets.filter(
                                (s) => s.name !== name
                            );
                            this.refreshPage();
                            this.secretFormGroup
                                .get('secret')
                                ?.updateValueAndValidity();
                            this.snackbarService.openSuccess(
                                'Successfully deleted secret with name: ' + name
                            );
                        },
                        error: () => {
                            this.snackbarService.openError(
                                'Error deleting secret with name: ' + name
                            );
                        },
                    });
            });
    }

    handlePageEvent(e: PageEvent): void {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.refreshPage();
    }

    private refreshPage(): void {
        const lastPage = Math.max(
            0,
            Math.ceil(this.secrets.length / this.pageSize) - 1
        );
        this.pageIndex = Math.min(this.pageIndex, lastPage);
        const start = this.pageIndex * this.pageSize;
        this.paginatedSecrets = this.secrets.slice(
            start,
            start + this.pageSize
        );
    }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretManagementDetailComponent } from './secret-management-detail.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedSecretsService } from '@app/shared/mocks/secrets.service.mock';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';

describe('SecretManagementDetailComponent', () => {
    let component: SecretManagementDetailComponent;
    let fixture: ComponentFixture<SecretManagementDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SecretManagementDetailComponent],
            imports: [
                NoopAnimationsModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: SecretsService, useValue: mockedSecretsService },
                {
                    provide: SnackbarService,
                    useValue: mockedSnackbarService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SecretManagementDetailComponent);
        component = fixture.componentInstance;
        component.data = { uuid: '1', name: 'Test' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('show default secret', () => {
        const compiled = fixture.debugElement;

        const title =
            compiled.nativeElement.querySelector('.title')?.textContent;
        expect(title).toContain('DEPLOYMENTS.DEPLOYMENT-SECRETS.TITLE');

        const subtitle =
            compiled.nativeElement.querySelector('#subtitle')?.textContent;
        expect(subtitle).toContain('DEPLOYMENTS.DEPLOYMENT-SECRETS.LIST');

        const deploymentName =
            compiled.nativeElement.querySelector('.tool-title')?.textContent;
        expect(deploymentName).toContain('Test');

        const secretName =
            compiled.nativeElement.querySelector('#secret-name')?.textContent;
        expect(secretName).toBe('default');

        const secretValue = compiled.query(By.css('#secret'));
        expect(secretValue.nativeElement.getAttribute('type')).toEqual(
            'password'
        );

        expect(secretValue.nativeElement.value).toBe('1234');
    });

    it('create new secret', () => {
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );
        const button = fixture.debugElement.query(By.css('#add-button'));
        const input = fixture.debugElement.query(By.css('#input'));
        const el = input.nativeElement;
        expect(el.value).toBe('');
        expect(button.nativeElement.disabled).toBeTruthy();

        component.secretFormGroup.setValue({ secret: 'client1' });
        fixture.detectChanges();
        expect(el.value).toBe('client1');
        expect(button.nativeElement.disabled).toBeFalsy();

        button.nativeElement.click();
        fixture.detectChanges();
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
    });

    it('should NOT create duplicated secret', () => {
        const button = fixture.debugElement.query(By.css('#add-button'));
        const input = fixture.debugElement.query(By.css('#input'));
        const el = input.nativeElement;

        expect(el.value).toBe('');
        expect(button.nativeElement.disabled).toBeTruthy();

        component.secretFormGroup.setValue({ secret: 'default' });
        expect(el.value).toBe('default');
        expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should NOT create empty secret (whitespaces)', () => {
        const button = fixture.debugElement.query(By.css('#add-button'));
        const input = fixture.debugElement.query(By.css('#input'));
        const el = input.nativeElement;

        expect(el.value).toBe('');
        expect(button.nativeElement.disabled).toBeTruthy();

        component.secretFormGroup.setValue({ secret: '    ' });
        expect(el.value).toBe('    ');
        expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should NOT delete a secret if user does not confirm it', () => {
        const button = fixture.debugElement.query(By.css('#delete-button'));
        button.nativeElement.click();

        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(false) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteSecret = jest.spyOn(
            mockedSecretsService,
            'deleteSecret'
        );

        component.deleteSecret('default');
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteSecret).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.secrets).toEqual([
            { hide: true, name: 'default', value: '1234' },
        ]);
    });

    it('should delete a secret if user confirms it', () => {
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteSecret = jest.spyOn(
            mockedSecretsService,
            'deleteSecret'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );
        const button = fixture.debugElement.query(By.css('#delete-button'));
        button.nativeElement.click();

        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteSecret).toHaveBeenCalledTimes(1);
        expect(spySuccessSnackbar).toHaveBeenCalledWith(
            'Successfully deleted secret with name: default'
        );
        expect(fixture.componentInstance.secrets).toEqual([]);
    });
});

import {
    Component,
    inject,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ServicesCredentialsStore } from '@app/modules/profile/store/services-credentials.store';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UiLoaderComponent } from '../../../../../shared/components/ui/ui-loader/ui-loader.component';
import { ServiceCardComponent } from '../../service-card/service-card.component';
import { UiCredentialRowComponent } from '../../../../../shared/components/ui/ui-credential-row/ui-credential-row.component';
import { UiButtonComponent } from '../../../../../shared/components/ui/ui-button/ui-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-services-tab',
    templateUrl: './services-tab.component.html',
    styleUrls: ['./services-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiLoaderComponent,
        ServiceCardComponent,
        UiCredentialRowComponent,
        UiButtonComponent,
        MatTooltip,
        TranslatePipe,
    ],
})
export class ServicesTabComponent implements OnInit {
    store = inject(ServicesCredentialsStore);
    appConfigService = inject(AppConfigService);
    private confirmationDialog = inject(MatDialog);

    ngOnInit(): void {
        this.store.ensureLoaded();
    }

    syncMlflow(): void {
        const url =
            this.appConfigService.projectName === 'iMagine'
                ? 'https://mlflow.cloud.imagine-ai.eu/signup'
                : 'https://mlflow.cloud.ai4eosc.eu/signup';
        window.open(url);
    }

    startLoginWithHuggingFace(): void {
        this.store.startLoginWithHuggingFace();
    }

    unsyncHuggingFace(): void {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'PROFILE.SERVICES-TAB.DIALOG.TITLE',
                    subtitlePrefix:
                        'PROFILE.SERVICES-TAB.DIALOG.SUBTITLE-PREFIX',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'PROFILE.SERVICES-TAB.DIALOG.UNLINK',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.store.unsyncHuggingFace();
                }
            });
    }
}

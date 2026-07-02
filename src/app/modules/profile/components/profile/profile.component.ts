import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { distinctUntilChanged } from 'rxjs';
import { VoInfo } from '@app/shared/interfaces/profile.interface';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Tab } from '@app/shared/components/ui/ui-tabs/ui-tabs.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        public confirmationDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    appConfigService = inject(AppConfigService);

    isAuthorized = false;

    get tabs(): Tab[] {
        return [
            {
                id: 'overview',
                label: 'PROFILE.OVERVIEW-TAB.TITLE',
                icon: 'user_attributes',
            },
            {
                id: 'apikeys',
                label: 'PROFILE.API-KEYS-TAB.TITLE',
                icon: 'vpn_key',
                disabled: !this.isAuthorized,
                tooltip: 'PROFILE.API-KEYS-TAB.DISABLE-TOOLTIP',
            },
            {
                id: 'storage',
                label: 'PROFILE.STORAGE-TAB.TITLE',
                icon: 'storage',
                disabled: !this.isProjectMember,
                tooltip: 'PROFILE.STORAGE-TAB.DISABLE-TOOLTIP',
            },
            {
                id: 'services',
                label: 'PROFILE.SERVICES-TAB.TITLE',
                icon: 'layers',
            },
        ];
    }
    activeTab = 'overview';

    onTabSelected(tabId: string) {
        this.activeTab = tabId;
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    protected sub = '';
    protected roles: string[] = [];
    name = '';
    email = '';

    isProjectMember = false;

    protected vos: VoInfo[] = [];

    ngOnInit(): void {
        this.authService.isDoneLoading$.subscribe((done) => {
            if (done) {
                this.authService.loadUserProfile();
            }
        });

        this.authService.userProfileSubject
            .pipe(
                distinctUntilChanged(
                    (prev, curr) =>
                        JSON.stringify(prev) === JSON.stringify(curr)
                )
            )
            .subscribe((profile) => {
                if (profile) {
                    this.name = profile.name;
                    this.email = profile.email;
                    this.sub = profile.sub;
                    this.isAuthorized = profile.isAuthorized;
                    this.isProjectMember = profile.isProjectMember;

                    if (profile.roles) {
                        this.getVoInfo(profile.roles);
                    }
                }
            });
    }

    getVoInfo(roles: string[]) {
        roles.forEach((role) => {
            const match = role.match(
                /^access:([^:]+):(ap-a|ap-a1|ap-b|ap-u|ap-d)$/
            );

            if (match) {
                const voName = match[1]; // e.g. "vo.ai4eosc.eu"
                const accessType = match[2]; // "ap-u", "ap-b", "ap-a", etc
                const index = this.vos.findIndex((v) => v.name === voName);
                if (index === -1) {
                    this.vos.push({ name: voName, roles: [accessType] });
                } else {
                    if (!this.vos[index].roles.includes(accessType)) {
                        this.vos[index].roles.push(accessType);
                    }
                }
            }

            // sort vos by current vo first
            this.vos.sort((a, b) => {
                if (a.name === this.appConfigService.voName) return -1;
                if (b.name === this.appConfigService.voName) return 1;
                return 0;
            });

            // sort roles by access level
            this.vos.forEach((vo) => {
                vo.roles.sort((a, b) => {
                    const order = [
                        'ap-d',
                        'ap-u',
                        'ap-b',
                        'ap-a1',
                        'ap-a',
                        'ap-0',
                    ];
                    return order.indexOf(a) - order.indexOf(b);
                });
            });
        });
    }
}

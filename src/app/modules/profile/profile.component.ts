import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoginResponse, ProfileService } from './services/profile.service';

export interface VoInfo {
    name: string;
    roles: string[];
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        private profileService: ProfileService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        authService.loadUserProfile();
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    protected isLoading = true;

    protected name: string = '';
    protected email: string = '';
    protected vos: VoInfo[] = [];
    protected ai4osEndpoint =
        'https://share.services.ai4os.eu/index.php/login/v2';
    protected customEndpoint = 'https://<your.domain>/index.php/login/v2';

    ngOnInit(): void {
        this.authService.userProfileSubject.subscribe((profile) => {
            this.name = profile.name;
            this.email = profile.email;
            this.getVoInfo(profile.eduperson_entitlement);
            this.isLoading = false;
        });
    }

    getVoInfo(eduperson_entitlement: string[]) {
        eduperson_entitlement.forEach((e) => {
            const voMatch = e.match(/vo\.[^:]+/);
            const roleMatch = e.match(/role=([^#]+)/);

            let voName = voMatch ? voMatch[0] : '';
            voName = voName.substring(3);
            voName = voName.substring(0, voName.length - 3);
            const role = roleMatch ? roleMatch[1] : '';

            let index = this.vos.findIndex((v) => v.name === voName);
            if (index !== -1) {
                this.vos[index].roles.push(role);
            } else {
                let newVo = { name: voName, roles: [role] };
                this.vos.push(newVo);
            }
        });
    }

    syncRclone() {
        this.profileService
            .initLogin('share.services.ai4os.eu')
            .subscribe((response: LoginResponse) => {
                window.open(response.login, '_blank');
            });
    }
}

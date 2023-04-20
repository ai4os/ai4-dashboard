import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { authCodeFlowConfig } from './auth.config';


export interface UserProfile {
  name: string
}

@Injectable()
export class AuthService {
  constructor(private oauthService: OAuthService){
    this.configureOAuthService();
  }

  userProfileSubject = new Subject<UserProfile>();

  configureOAuthService() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
      if (isLoggedIn && this.isAuthenticated()) {
        this.oauthService.loadUserProfile().then((profile: any) => {
          let userProfile: UserProfile= {
            name: profile['info']['name']
          }
          this.userProfileSubject.next(userProfile)
        });
      }
    });
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    localStorage.clear();
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return !!this.oauthService.getIdToken();
  }

}

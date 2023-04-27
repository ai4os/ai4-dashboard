import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { authCodeFlowConfig } from './auth.config';


export interface UserProfile {
  name: string
}

@Injectable()
export class AuthService {
  constructor(
    private oauthService: OAuthService,
    private router: Router
    ) {
    this.configureOAuthService();
  }

  userProfileSubject = new Subject<UserProfile>();

  /**
   * Configure the oauth service, tries to login and saves the user profile for display.
   * 
   *
   * @memberof AuthService
   */
  configureOAuthService() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
      if (isLoggedIn && this.isAuthenticated()) {
        if (this.oauthService.hasValidAccessToken()) {
          this.oauthService.loadUserProfile().then((profile: any) => {
            let userProfile: UserProfile = {
              name: profile['info']['name']
            }
            this.userProfileSubject.next(userProfile)
            if (this.oauthService.state && this.oauthService.state !== 'undefined' && this.oauthService.state !== 'null') {
              let stateUrl = this.oauthService.state;
              if (stateUrl.startsWith('/') === false) {
                stateUrl = decodeURIComponent(stateUrl);
              }
              this.router.navigateByUrl(stateUrl);
            }
          });
        }else{
          // Renew access token as we are logged in, the token expired and the app couldn't auto renew it
          this.oauthService.refreshToken();
        }
      }
    });
  }

  login(url: string) {
    this.oauthService.initLoginFlow(url);
  }

  logout() {
    localStorage.clear();
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return !!this.oauthService.getIdToken();
  }

}

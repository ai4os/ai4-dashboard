import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent  implements OnInit{
  constructor(
    private readonly authService: AuthService, 
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,    
    protected appConfigService: AppConfigService
  ){
    this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
    authService.userProfileSubject.subscribe( profile => {
      this.userProfile = profile;
    })
  }
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  userProfile? : UserProfile
  isMatMenuOpen = false;
  enteredButton = false;

  login(){
    this.authService.login(window.location.pathname);
  }

  logout(){
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  menuenter() {
    this.isMatMenuOpen = true;
  }

  

  menuLeave(trigger: any, button: any) {
    setTimeout(() => {
      if(!this.enteredButton){
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else{
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  buttonEnter(trigger: any) {
    setTimeout(() => {
      if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else {
        this.enteredButton = true;
      }
    }, 50)
  }


  buttonLeave(trigger:any , button: any) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }

  isAuthorized(){
    return this.userProfile?.isAuthorized;
  }

  toggleSidenav(){
    this.sidenavService.toggle();
  }

  ngOnInit(): void {
  }
  
}

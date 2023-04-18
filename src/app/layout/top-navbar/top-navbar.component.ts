import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent  implements OnInit{
  constructor(
    private readonly authService: AuthService, 
    private ren: Renderer2
  ){
    authService.userProfileSubject.subscribe( profile => {
      this.userProfile = profile;
    })
  }

  userProfile? : UserProfile
  isMatMenuOpen = false;
  enteredButton = false;
  prevButtonTrigger: any;

  login(){
    this.authService.login();
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
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
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

  ngOnInit(): void {
  }
  
}

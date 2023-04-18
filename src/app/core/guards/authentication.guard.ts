import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


export const AuthenticationGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }else{
    console.log("No estoy logeado")
  }

  // Redirect to the login page
  return router.parseUrl('/login');
};


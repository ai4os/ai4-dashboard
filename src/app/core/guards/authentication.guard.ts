import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { tap } from 'rxjs';

export const AuthenticationGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return authService.canActivateProtectedRoutes$.pipe(
        tap(() => router.navigate(['/marketplace']))
    );
};

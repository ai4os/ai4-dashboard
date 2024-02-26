import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { authAppInitializerFactory } from './services/auth/auth-app-initializer.factory';
import { OAuthStorage } from 'angular-oauth2-oidc';

// We need a factory since localStorage is not available at AOT build time

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
    providers: [
        {
            provide: AuthService,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: authAppInitializerFactory,
            deps: [AuthService],
            multi: true,
        },
    ],
})
export class CoreModule {}

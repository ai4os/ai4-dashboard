import { NgModule, provideAppInitializer, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { authAppInitializerFactory } from './services/auth/auth-app-initializer.factory';

// We need a factory since localStorage is not available at AOT build time

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
    providers: [
        {
            provide: AuthService,
        },
        provideAppInitializer(() => {
            const authService = inject(AuthService);
            return authAppInitializerFactory(authService)();
        }),
    ],
})
export class CoreModule {}

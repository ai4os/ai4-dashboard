import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

interface EGICheckinError {
    error: string;
    error_description: string;
}

const isEGICheckinError = (value: EGICheckinError): value is EGICheckinError =>
    !!value?.error;

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private readonly injector: Injector,
        private snackbarService: SnackbarService,
        private router: Router,
        private authService: AuthService
    ) {}

    showSnackbar(messageStringKey: string, errorMessage: string) {
        const translateService = this.injector.get(TranslateService);
        translateService.get(messageStringKey).subscribe((value: any) => {
            if (errorMessage) {
                this.snackbarService.openError(value + '\n ' + errorMessage);
            } else {
                this.snackbarService.openError(value);
            }
        });
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next
            .handle(request)

            .pipe(
                retry(1),

                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';

                    // client-side error
                    if (error.error.detail) {
                        errorMessage = `Error: ${error.error.detail}`;
                    }
                    // EGI error, token expired. User will be logged-out.
                    if (
                        error.status == 400 &&
                        isEGICheckinError(error.error) &&
                        error.error.error === 'invalid_grant'
                    ) {
                        this.showSnackbar('ERRORS.TOKEN-EXPIRED', errorMessage);
                        return throwError(() => errorMessage);
                    }
                    if (
                        (error.status === 401 || error.status === 403) &&
                        !error.url?.includes(
                            'https://api.github.com/repos/AI4EOSC/status/issues'
                        )
                    ) {
                        this.router.navigate([
                            'forbidden',
                            { errorMessage: errorMessage },
                        ]);
                        this.authService.logout();
                    }
                    // Polling error (sync account)
                    if (
                        error.status == 404 &&
                        request.url.includes('/index.php/login/v2/poll')
                    ) {
                        return throwError(() => errorMessage);
                    }

                    this.showSnackbar('ERRORS.API-ERROR', errorMessage);

                    return throwError(() => errorMessage);
                })
            );
    }
}

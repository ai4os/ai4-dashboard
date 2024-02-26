import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private readonly injector: Injector,
        private _snackBar: MatSnackBar,
        private router: Router,
        private authService: AuthService
    ) {}

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

                    if (error.status === 401 || error.status === 403) {
                        this.router.navigate([
                            'forbidden',
                            { errorMessage: errorMessage },
                        ]);
                        this.authService.logout();
                    }
                    try {
                        const translateService =
                            this.injector.get(TranslateService);
                        this._snackBar.open(
                            translateService.instant('ERRORS.SERVICE-ERROR') +
                                '\n ' +
                                errorMessage,
                            'X',
                            {
                                duration: 10000,
                                panelClass: ['red-snackbar'],
                            }
                        );
                    } catch {
                        // log without translation translation service is not yet available
                        this._snackBar.open(
                            'Error calling the API, please retry later',
                            'X',
                            {
                                duration: 3000,
                                panelClass: ['red-snackbar'],
                            }
                        );
                    }

                    return throwError(() => errorMessage);
                })
            );
    }
}

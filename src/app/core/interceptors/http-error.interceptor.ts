import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse

} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private readonly injector: Injector,
        private _snackBar: MatSnackBar,
    ) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)

            .pipe(

                retry(1),

                catchError((error: HttpErrorResponse) => {

                    let errorMessage = '';

                    if (error.error instanceof ErrorEvent) {

                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;

                    } else {

                        // server-side error
                        errorMessage = `Error Code: ${error.status}`;

                    }
                    try {
                        const translateService = this.injector.get(TranslateService)
                        this._snackBar.open(translateService.instant("ERRORS.SERVICE-ERROR") + "\n "+ errorMessage, "X",
                            {
                                duration: 3000,
                                panelClass: ['red-snackbar']
                            })
                    } catch {
                        // log without translation translation service is not yet available
                        this._snackBar.open("Error calling the API, please retry later", "X",
                            {
                                duration: 3000,
                                panelClass: ['red-snackbar']
                            })
                    }



                    return throwError(() => errorMessage);

                })

            )

    }

}
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    RequestLoginResponse,
    CompleteLoginResponse,
} from '@app/shared/interfaces/profile.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    initLogin(url: string): Observable<RequestLoginResponse> {
        //const url = 'https://' + domain + '/index.php/login/v2';
        const body = {};
        return this.http.post<RequestLoginResponse>(url, body);
    }

    getCredentials(
        loginResponse: RequestLoginResponse
    ): Observable<HttpResponse<CompleteLoginResponse>> {
        const url = loginResponse.poll.endpoint;
        const body = `token=${loginResponse.poll.token}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post<CompleteLoginResponse>(url, body, {
            headers,
            observe: 'response',
        });
    }
}

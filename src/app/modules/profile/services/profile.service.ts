import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RequestLoginResponse {
    poll: {
        token: string;
        endpoint: string;
    };
    login: string;
}

export interface CompleteLoginResponse {
    server: string;
    loginName: string;
    appPassword: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    initLogin(domain: string): Observable<RequestLoginResponse> {
        const url = 'https://' + domain + '/index.php/login/v2';
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
    poll: {
        token: string;
        endpoint: string;
    };
    login: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    initLogin(domain: string): Observable<LoginResponse> {
        const url = 'https://' + domain + '/index.php/login/v2';
        const body = {};
        return this.http.post<LoginResponse>(url, body);
    }
}

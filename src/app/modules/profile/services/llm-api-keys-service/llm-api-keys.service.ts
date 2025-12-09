import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { LiteLLMKeyResponse } from '@app/shared/interfaces/profile.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class LlmApiKeysService {
    constructor(private http: HttpClient) {}

    getLiteLLMKeys(): Observable<LiteLLMKeyResponse[]> {
        const url = `${base}${endpoints.litellm}`;
        return this.http.get<Array<LiteLLMKeyResponse>>(url);
    }

    createLiteLLMKey(name: string): Observable<string> {
        const url = `${base}${endpoints.litellm}`;
        const params = new HttpParams().set('name', name);
        const body = {};
        return this.http.post<string>(url, body, { params });
    }

    deleteLiteLLMKey(name: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.litellm}`;
        const params = new HttpParams().set('name', name);
        return this.http.delete<StatusReturn>(url, { params });
    }
}

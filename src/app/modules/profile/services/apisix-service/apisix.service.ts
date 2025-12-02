import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { APIsixKeyResponse } from '@app/shared/interfaces/profile.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ApisixService {
    constructor(private http: HttpClient) {}

    getApisixKeys(): Observable<APIsixKeyResponse[]> {
        const url = `${base}${endpoints.apisix}`;
        return this.http.get<Array<APIsixKeyResponse>>(url);
    }

    createApisixKey(name: string): Observable<string> {
        const url = `${base}${endpoints.apisix}`;
        const params = new HttpParams().set('name', name);
        const body = {};
        return this.http.post<string>(url, body, { params });
    }

    deleteApisixKey(name: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.apisix}`;
        const params = new HttpParams().set('name', name);
        return this.http.delete<StatusReturn>(url, { params });
    }
}

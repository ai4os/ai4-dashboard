import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import {
    ChatRequest,
    ChatResponse,
} from '@app/shared/interfaces/chat.interface';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ChatBotService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    requestResponse(request: ChatRequest): Observable<ChatResponse> {
        const url = `${base}${endpoints.chatCompletions}`;
        const params = new HttpParams().set('vo', this.appConfigService.voName);

        return this.http.post<ChatResponse>(url, request, {
            params: params,
        });
    }
}

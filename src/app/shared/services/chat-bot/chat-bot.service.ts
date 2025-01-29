import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import {
    ChatRequest,
    ChatResponse,
} from '@app/shared/interfaces/chat.interface';

const { endpoints } = environment.api;

const base = 'https://llm.dev.ai4eosc.eu/api';
const apiKey = environment.llmApiKey;

@Injectable({
    providedIn: 'root',
})
export class ChatBotService {
    constructor(private http: HttpClient) {}

    requestResponse(request: ChatRequest): Observable<ChatResponse> {
        const url = `${base}${endpoints.chatCompletions}`;

        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + apiKey,
        };

        return this.http.post<ChatResponse>(url, request, { headers: headers });
    }
}

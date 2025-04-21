import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ChatRequest } from '@app/shared/interfaces/chat.interface';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { OAuthService } from 'angular-oauth2-oidc';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ChatBotService {
    constructor(
        private oauthService: OAuthService,
        private appConfigService: AppConfigService
    ) {}

    requestResponse(request: ChatRequest): Observable<string> {
        const url = `${base}${endpoints.chatCompletions}`;
        const params = new HttpParams().set('vo', this.appConfigService.voName);
        const token = this.oauthService.getAccessToken();

        return new Observable<string>((observer) => {
            fetch(`${url}?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            })
                .then((response) => {
                    if (!response.ok || !response.body) {
                        throw new Error(
                            'Error connecting to the LLM, please try again later'
                        );
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    const read = () => {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                observer.complete();
                                return;
                            }
                            const chunk = decoder.decode(value, {
                                stream: true,
                            });
                            observer.next(chunk);
                            read();
                        });
                    };
                    read();
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import {
    PlatformLlmSummary,
    SelfLllmSummary,
} from '@app/shared/interfaces/llms.interface';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
const { base, endpoints } = environment.api;

@Injectable({ providedIn: 'root' })
export class LlmsService {
    http = inject(HttpClient);
    appConfigService = inject(AppConfigService);
    translateService = inject(TranslateService);

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getSefLlmsSummary(): Observable<SelfLllmSummary[]> {
        const url = `${base}${endpoints.llmsSelfSummary}`;
        return this.http.get<SelfLllmSummary[]>(url);
    }

    getPlatformLlmsSummary(): Observable<PlatformLlmSummary[]> {
        const url = `${base}${endpoints.llmsPlatformSummary}`;
        return this.http.get<PlatformLlmSummary[]>(url).pipe(
            map((llms) =>
                llms.map((llm) => {
                    const parts = llm.id.split('/');
                    const name =
                        parts.length >= 2 ? parts[parts.length - 1] : llm.id;
                    const family =
                        parts.length >= 2 ? parts[parts.length - 2] : 'unknown';

                    return {
                        ...llm,
                        name: name,
                        family: family,
                        description:
                            llm.description ||
                            this.translateService.instant(
                                'CATALOG.LLMS.PLATFORM-WIDE-DESC'
                            ),
                        maxInputTokens: llm.max_input_tokens,
                        supports_function_calling:
                            llm.supports_function_calling,
                        supports_reasoning: llm.supports_reasoning,
                        supports_vision: llm.supports_vision,
                    };
                })
            )
        );
    }
}

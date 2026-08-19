import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    PlatformLlmSummary,
    SelfLllmSummary,
} from '@app/shared/interfaces/llms.interface';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
const { base, endpoints } = environment.api;

@Service()
export class LlmsService {
    http = inject(HttpClient);
    appConfigService = inject(AppConfigService);

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
                    // TODO: improve when metadata is ready
                    return {
                        ...llm,
                        name: name,
                        family: family,
                        description:
                            llm.description ||
                            'TBD: Platform-wide LLM served via LiteLLM.',
                        context: llm.context,
                        license: llm.license,
                    };
                })
            )
        );
    }
}

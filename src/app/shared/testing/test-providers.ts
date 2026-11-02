import { importProvidersFrom } from '@angular/core';
import {
    ActivatedRoute,
    convertToParamMap,
    provideRouter,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateTesting } from './translate-testing';
import { NgxEchartsModule } from 'ngx-echarts';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedMediaMatcher } from '../mocks/media-matcher.mock';
import { MarkdownService } from 'ngx-markdown';
import { mockedMarkdownService } from '../mocks/markdown.service.mock';
import { of } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';

export const testProviders = [
    provideRouter([]),

    { provide: AppConfigService, useValue: mockedConfigService },

    provideHttpClient(),

    provideHttpClientTesting(),

    provideTranslateTesting(),

    provideNativeDateAdapter(),

    importProvidersFrom(
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        })
    ),
    { provide: MediaMatcher, useValue: mockedMediaMatcher },
    { provide: MarkdownService, useValue: mockedMarkdownService },

    {
        provide: ActivatedRoute,
        useValue: {
            params: of({
                id: 'test',
            }),
            data: of({}),
            url: of([]),
            queryParams: of({}),
            snapshot: {
                paramMap: {
                    get: () => 'test', // represents the id
                },
                queryParamMap: {
                    get: () => null,
                },
            },
            queryParamMap: of(convertToParamMap({})),
            routeConfig: { path: 'test' },
            children: [],
        },
    },
];

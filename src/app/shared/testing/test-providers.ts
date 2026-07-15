import { importProvidersFrom } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
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

export const testProviders = [
    provideRouter([]),

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
            snapshot: {
                paramMap: {
                    get: () => 'test', // represents the id
                },
            },
            routeConfig: { path: 'test' },
        },
    },
];

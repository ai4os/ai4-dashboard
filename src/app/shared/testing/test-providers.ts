import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateTesting } from './translate-testing';

export const COMMON_TEST_PROVIDERS = [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideTranslateTesting(),
];

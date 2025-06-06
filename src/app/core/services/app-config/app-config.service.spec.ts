import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    mockedConfig,
    mockedOAuthModuleConfig,
} from '@app/shared/mocks/oauth.module.config.mock';

describe('AppConfigService', () => {
    let service: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(AppConfigService);
        service['appConfig'] = mockedConfig;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load the app config correctly', () => {
        const spy = jest
            .spyOn(service, 'loadAppConfig')
            .mockReturnValue(Promise.resolve());
        service.loadAppConfig(mockedOAuthModuleConfig);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(service['appConfig']).toEqual(mockedConfig);
    });

    it('should throw error if trying to access the config file before its loaded', () => {
        service['appConfig'] = undefined;
        expect(() => {
            service.checkConfigFileLoaded();
        }).toThrow('Config file not loaded!');
    });

    it('should NOT throw error if trying to access the config file before its loaded', () => {
        expect(() => {
            service.checkConfigFileLoaded();
        }).not.toThrow();
    });

    it('should return title correctly', () => {
        const title = service.title;
        expect(title).toBe(mockedConfig.title);
    });

    it('should return sidenavMenu correctly', () => {
        const sidenavMenu = service.sidenavMenu;
        expect(sidenavMenu).toBe(mockedConfig.sidenavMenu);
    });

    it('should return tags correctly', () => {
        const tags = service.tags;
        expect(tags).toBe(undefined);
    });

    it('should return voName correctly', () => {
        const voName = service.voName;
        expect(voName).toBe(mockedConfig.voName);
    });

    it('should return acknowledgments correctly', () => {
        const acknowledgments = service.acknowledgments;
        expect(acknowledgments).toBe(mockedConfig.acknowledgments);
    });

    it('should return projectName correctly', () => {
        const projectName = service.projectName;
        expect(projectName).toBe(mockedConfig.projectName);
    });

    it('should return projectUrl correctly', () => {
        const projectUrl = service.projectUrl;
        expect(projectUrl).toBe(mockedConfig.projectUrl);
    });

    it('should return legalLinks correctly', () => {
        const legalLinks = service.footerLinks;
        expect(legalLinks).toBe(mockedConfig.footerLinks);
    });
});

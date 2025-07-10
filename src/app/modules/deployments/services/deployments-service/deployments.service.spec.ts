import { TestBed } from '@angular/core/testing';

import { DeploymentsService } from './deployments.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import {
    mockedDeployments,
    mockedTools,
} from '@app/modules/deployments/services/deployments-service/deployments.service.mock';

const { base, endpoints } = environment.api;

describe('DeploymentsService', () => {
    let service: DeploymentsService;
    let httpMock: HttpTestingController;
    let expectedURL: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });

        service = TestBed.inject(DeploymentsService);
        httpMock = TestBed.inject(HttpTestingController);

        expectedURL = `${base}${endpoints.deployments}?vos=vo.ai4eosc.eu`;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getDeployments should return a list of deployments that are modules', (done) => {
        service.getDeployments().subscribe((list) => {
            try {
                expect(list).toEqual(mockedDeployments);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush(mockedDeployments);
        expect(req.request.method).toBe('GET');
    });

    it('getDeploymentByUUID should return a single deployment by UUID', (done) => {
        const deploymentUUID = 'test';
        const expectedURL = `${base}${endpoints.deploymentByUUID.replace(':deploymentUUID', deploymentUUID)}?vo=vo.ai4eosc.eu`;

        service.getDeploymentByUUID(deploymentUUID).subscribe((deployment) => {
            try {
                expect(deployment).toEqual(mockedDeployments[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush(mockedDeployments[0]);
        expect(req.request.method).toBe('GET');
    });

    it('should request the training of a module correctly', (done) => {
        const request: TrainModuleRequest = {
            general: {
                title: 'testing',
                desc: 'description',
                docker_image: '',
                docker_tag: '',
                service: '',
                jupyter_password: undefined,
            },
            hardware: {
                cpu_num: 1,
                ram: 100,
                disk: 0,
                gpu_num: 0,
                gpu_type: undefined,
            },
        };
        const expectedURL = `${base}${endpoints.trainModule}?vo=vo.ai4eosc.eu`;

        service.postTrainModule(request).subscribe((response) => {
            try {
                expect(response).toEqual({ status: 'success' });
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush({ status: 'success' });
        expect(req.request.method).toBe('POST');
    });

    it('should delete a deployment correctly', (done) => {
        const deploymentUUID = 'test';
        const expectedURL = `${base}${endpoints.deploymentByUUID.replace(':deploymentUUID', deploymentUUID)}?vo=vo.ai4eosc.eu`;

        service.deleteDeploymentByUUID(deploymentUUID).subscribe((response) => {
            try {
                expect(response).toEqual({ status: 'success' });
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush({ status: 'success' });
        expect(req.request.method).toBe('DELETE');
    });

    /**
     * TOOLS TESTS
     */

    it('getTools should return a list of tools', (done) => {
        const toolsURL = `${base}${endpoints.tools}?vos=vo.ai4eosc.eu`;

        service.getTools().subscribe((list) => {
            try {
                expect(list).toEqual(mockedTools);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(toolsURL);
        req.flush(mockedTools);
        expect(req.request.method).toBe('GET');
    });

    it('getToolByUUID should return a single tool by UUID', (done) => {
        const toolUUID = 'test';
        const toolURL = `${base}${endpoints.toolByUUID.replace(':deploymentUUID', toolUUID)}?vo=vo.ai4eosc.eu`;

        service.getToolByUUID(toolUUID).subscribe((tool) => {
            try {
                expect(tool).toEqual(mockedTools[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(toolURL);
        req.flush(mockedTools[0]);
        expect(req.request.method).toBe('GET');
    });

    it('should request the training of a tool correctly', (done) => {
        const request: TrainModuleRequest = {
            general: {
                title: 'testing',
                desc: 'description',
                docker_image: '',
                docker_tag: '',
                service: '',
                jupyter_password: undefined,
            },
            hardware: {
                cpu_num: 1,
                ram: 100,
                disk: 100,
                gpu_num: 0,
                gpu_type: undefined,
            },
        };
        const toolName = 'ai4os-federated-server';
        const toolTrainURL = `${base}${endpoints.trainTool}?vo=vo.ai4eosc.eu&tool_name=${toolName}`;

        service.trainTool(toolName, request).subscribe((response) => {
            try {
                expect(response).toEqual({ status: 'success' });
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(toolTrainURL);
        req.flush({ status: 'success' });
        expect(req.request.method).toBe('POST');
    });

    it('should delete a tool correctly', (done) => {
        const toolUUID = 'test';
        const toolURL = `${base}${endpoints.toolByUUID.replace(':deploymentUUID', toolUUID)}?vo=vo.ai4eosc.eu`;

        service.deleteToolByUUID(toolUUID).subscribe((response) => {
            try {
                expect(response).toEqual({ status: 'success' });
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(toolURL);
        req.flush({ status: 'success' });
        expect(req.request.method).toBe('DELETE');
    });
});

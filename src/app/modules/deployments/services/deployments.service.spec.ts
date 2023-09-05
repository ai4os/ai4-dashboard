import { TestBed } from '@angular/core/testing';

import { DeploymentsService } from './deployments.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { deploymentsList, toolsList } from './deployment.service.mock';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};
const { base } = environment.api;

describe('DeploymentsService', () => {
    let service: DeploymentsService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(DeploymentsService);
        httpMock = TestBed.inject(HttpTestingController);
        /*         jest.spyOn(mockedConfigService, 'voName', 'get').mockReturnValue(
            'test'
        ) */ jest.mock('./deployments.service', () => ({
            getDeployments: jest.fn().mockReturnValue(of(deploymentsList)),
            getDeploymentByUUID: jest
                .fn()
                .mockReturnValue(of(deploymentsList[0])),
            getToolByUUID: jest.fn().mockReturnValue(of(toolsList[0])),
            postTrainModule: jest
                .fn()
                .mockReturnValue(of({ status: 'success' })),
            trainTool: jest.fn().mockReturnValue(of({ status: 'success' })),
            getTools: jest.fn().mockReturnValue(of(toolsList)),
            deleteDeploymentByUUID: jest
                .fn()
                .mockReturnValue(of({ status: 'success' })),
            deleteToolByUUID: jest
                .fn()
                .mockReturnValue(of({ status: 'success' })),
        }));
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getDeployments should return a list of deployments that are modules', () => {
        const url = `${base}/deployments/modules?vos=vo.ai4eosc.eu`;
        const deploymentLists = service.getDeployments();
        deploymentLists.subscribe((list) => {
            expect(list).toBe(deploymentsList);
        });
        const req = httpMock.expectOne(url);
        req.flush(deploymentsList);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getDeployments should return a single module by UUID', () => {
        const url = `${base}/deployments/modules/test?vo=vo.ai4eosc.eu`;
        const deployment = service.getDeploymentByUUID('test');
        deployment.subscribe((deployment) => {
            expect(deployment).toBe(deploymentsList[0]);
        });
        const req = httpMock.expectOne(url);
        req.flush(deploymentsList);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('should request the training of a module correctly', () => {
        const url = `${base}/deployments/modules?vo=vo.ai4eosc.eu`;
        const request: TrainModuleRequest = {
            general: {
                title: 'testing',
                desc: 'description',
                docker_image: '',
                docker_tag: '',
                service: '',
                jupyter_password: undefined,
                hostname: undefined,
            },
            hardware: {
                cpu_num: 1,
                ram: 100,
                disk: 0,
                gpu_num: 0,
                gpu_type: undefined,
            },
        };
        const requestResponse = service.postTrainModule(request);
        requestResponse.subscribe((response) => {
            expect(response).toBe({ status: 'success' });
        });
        const req = httpMock.expectOne(url);
        req.flush(deploymentsList);
        httpMock.verify();
        expect(req.request.method).toBe('POST');
    });

    it('should delete a deployment correctly', () => {
        const url = `${base}/deployments/modules/test?vo=vo.ai4eosc.eu`;
        const requestResponse = service.deleteDeploymentByUUID('test');
        requestResponse.subscribe((response) => {
            expect(response).toBe({ status: 'success' });
        });
        const req = httpMock.expectOne(url);
        req.flush(deploymentsList);
        httpMock.verify();
        expect(req.request.method).toBe('DELETE');
    });

    /**
     * TOOLS TESTS
     */

    it('getTools should return a list of deployments that are tools', () => {
        const url = `${base}/deployments/tools?vos=vo.ai4eosc.eu`;
        const toolsList = service.getTools();
        toolsList.subscribe((list) => {
            expect(list).toBe(toolsList);
        });
        const req = httpMock.expectOne(url);
        req.flush(toolsList);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getDeployments should return a single module by UUID', () => {
        const url = `${base}/deployments/tools/test?vo=vo.ai4eosc.eu`;
        const tool = service.getToolByUUID('test');
        tool.subscribe((tool) => {
            expect(tool).toBe(toolsList[0]);
        });
        const req = httpMock.expectOne(url);
        req.flush(toolsList);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('should request the training of a module correctly', () => {
        const url = `${base}/deployments/tools?vo=vo.ai4eosc.eu`;
        const request: TrainModuleRequest = {
            general: {
                title: 'testing',
                desc: 'description',
                docker_image: '',
                docker_tag: '',
                service: '',
                jupyter_password: undefined,
                hostname: undefined,
            },
            hardware: {
                cpu_num: 1,
                ram: 100,
                disk: 100,
                gpu_num: 0,
                gpu_type: undefined,
            },
        };
        const requestResponse = service.trainTool(request);
        requestResponse.subscribe((response) => {
            expect(response).toBe({ status: 'success' });
        });
        const req = httpMock.expectOne(url);
        req.flush(toolsList);
        httpMock.verify();
        expect(req.request.method).toBe('POST');
    });

    it('should delete a deployment correctly', () => {
        const url = `${base}/deployments/tools/test?vo=vo.ai4eosc.eu`;
        const requestResponse = service.deleteToolByUUID('test');
        requestResponse.subscribe((response) => {
            expect(response).toBe({ status: 'success' });
        });
        const req = httpMock.expectOne(url);
        req.flush(toolsList);
        httpMock.verify();
        expect(req.request.method).toBe('DELETE');
    });
});

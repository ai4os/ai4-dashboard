import { TestBed } from '@angular/core/testing';
import { TryMeService } from './try-me.service';
import { environment } from '@environments/environment';
import {
    HttpTestingController,
    HttpClientTestingModule,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { of } from 'rxjs';
import {
    createGradioDeploymentResponse,
    gradioDeployments,
} from './try-me.service.mock';
import { endpoints } from '@environments/endpoints';

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};

const { base } = environment.api;

describe('TryMeService', () => {
    let service: TryMeService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });

        service = TestBed.inject(TryMeService);
        httpMock = TestBed.inject(HttpTestingController);

        jest.mock('./try-me.service', () => ({
            createDeploymentGradio: jest
                .fn()
                .mockReturnValue(of(createGradioDeploymentResponse)),
            getDeploymentGradioByUUID: jest
                .fn()
                .mockReturnValue(of(gradioDeployments[0])),
            getDeploymentsGradio: jest
                .fn()
                .mockReturnValue(of(gradioDeployments)),
            deleteDeploymentByUUID: jest
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

    it('should request the gradio deployment of a module correctly', (done) => {
        const url = `${base}${endpoints.nomadTryMeDeployments}?module_name=dogs-breed-detector&title=pink_butterfly`;

        service
            .createDeploymentGradio('dogs-breed-detector', 'pink_butterfly')
            .subscribe((response) => {
                try {
                    expect(response).toEqual({
                        status: 'success',
                        job_ID: '700a0060-904e-11ef-a9af-67eed56a1e49',
                    });
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(url);
        req.flush(createGradioDeploymentResponse);
        httpMock.verify();
        expect(req.request.method).toBe('POST');
    });

    it('getDeploymentGradioByUUID should return a single module by UUID', (done) => {
        const url = `${base}${endpoints.nomadTryMeDeployment.replace(
            ':deployment_uuid',
            '9d7c8b08-904e-11ef-a9af-67eed56a1e44'
        )}`;
        service
            .getDeploymentGradioByUUID('9d7c8b08-904e-11ef-a9af-67eed56a1e44')
            .subscribe((deployment) => {
                try {
                    expect(deployment).toBe(gradioDeployments[1]);
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(url);
        req.flush(gradioDeployments[1]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getDeploymentsGradio should return a list of deployments', (done) => {
        const url = `${base}${endpoints.nomadTryMeDeployments}`;

        service.getDeploymentsGradio().subscribe((list) => {
            try {
                expect(list).toBe(gradioDeployments);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(gradioDeployments);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('should delete a deployment correctly', (done) => {
        const url = `${base}/try_me/nomad/9d7c8b08-904e-11ef-a9af-67eed56a1e44?vo=vo.ai4eosc.eu`;
        service
            .deleteDeploymentByUUID('9d7c8b08-904e-11ef-a9af-67eed56a1e44')
            .subscribe((response) => {
                try {
                    expect(response).toEqual({ status: 'success' });
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(url);
        req.flush({ status: 'success' });
        httpMock.verify();
        expect(req.request.method).toBe('DELETE');
    });
});

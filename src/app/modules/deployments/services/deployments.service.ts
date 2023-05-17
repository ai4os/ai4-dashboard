import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Deployment, DeploymentInfo } from '@app/shared/interfaces/deployment.interface';
import { TrainModuleRequest, ModuleConfiguration } from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DeploymentsService {


  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);
 

  getDeployments(): Observable<Deployment[]> {
    const url = `${base}${endpoints.deployments}`;
    return this.http.get<Array<Deployment>>(url, { params: this.voParam });
  }

  getDeploymentByUUID(deploymentUUID: string): Observable<DeploymentInfo> {
    const url = `${base}${endpoints.deploymentByUUID.replace(
      ':deploymentUUID',
      deploymentUUID
    )}`;
    return this.http.get<DeploymentInfo>(url, { params: this.voParam });
  }

  postTrainModule(moduleConf: TrainModuleRequest): Observable<any> {
    const url = `${base}${endpoints.trainModule}`
    return this.http.post<ModuleConfiguration>(url, moduleConf, { params: this.voParam });
  }

  deleteDeploymentByUUID(deploymentUUID: string): Observable<Object> {
    const url = `${base}${endpoints.deploymentByUUID.replace(
      ':deploymentUUID',
      deploymentUUID
    )}`;
    return this.http.delete<Object>(url, { params: this.voParam });
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private http: HttpClient
  ) { }

  getDeployments(): Observable<Deployment[]>{
    const url = `${base}${endpoints.deployments}`;
    return this.http.get<Array<Deployment>>(url);
  }

  getDeploymentByUUID(deploymentUUID: string): Observable<DeploymentInfo>{
    const url = `${base}${endpoints.deploymentByUUID.replace(
      ':deploymentUUID',
      deploymentUUID
    )}`;
    return this.http.get<DeploymentInfo>(url);
  }

  postTrainModule(moduleConf: TrainModuleRequest): Observable<any>{
    const url = `${base}${endpoints.trainModule}`
    return this.http.post<ModuleConfiguration>(url, moduleConf);
  }

}

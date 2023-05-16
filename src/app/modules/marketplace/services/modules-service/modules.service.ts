import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Module, ModuleConfiguration, ModuleSummary } from '@app/shared/interfaces/module.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(
    private http: HttpClient,

  ) { }

  getModulesSummary(tags?: any): Observable<ModuleSummary[]> {
    const url = `${base}${endpoints.modulesSummary}`;
    if (tags) {
      let params = new HttpParams();
      Object.keys(tags).forEach((key: string) => {
        params = params.set(key, tags[key])
      });
      return this.http.get<Array<ModuleSummary>>(url, { params });
    }else{
      return this.http.get<Array<ModuleSummary>>(url);
    }
  }

  getModule(moduleName: string): Observable<Module> {

    const url = `${base}${endpoints.module.replace(
      ':name',
      moduleName
    )}`;
    return this.http.get<Module>(url);
  }

  getModuleConfiguration(moduleName: string): Observable<ModuleConfiguration> {
    const url = `${base}${endpoints.moduleConfiguration.replace(
      ':name',
      moduleName
    )}`;
    return this.http.get<ModuleConfiguration>(url);
  }

}

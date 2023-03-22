import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { Module, ModuleSummary } from '@app/shared/interfaces/module.interface';
import { HttpClient } from '@angular/common/http';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(
    private http: HttpClient,
  ) { }

  getModulesSummary(): Observable<ModuleSummary[]>{
    const url = `${base}${endpoints.modulesSummary}`;
    return this.http.get<Array<ModuleSummary>>(url);
  }

  getModule(moduleName: string): Observable<Module>{
    const url = `${base}${endpoints.module.replace(
      ':name',
      moduleName
    )}`;
    return this.http.get<Module>(url);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return firstValueFrom(this.http.get('/assets/config.json')).then(config => { this.appConfig = config; })
  }

  // This is an example property ... you can make it however you want.
  get title() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.title;
  }

  get sidenavMenu(){
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.sidenavMenu
  }
}

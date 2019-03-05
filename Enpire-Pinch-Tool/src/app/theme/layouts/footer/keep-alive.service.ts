import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../../_services/global-settings.service'

@Injectable()
export class KeepAliveService {

  constructor(private http: Http, private gc: GlobalSettingsService) { }

  keepAlive(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        const options = new RequestOptions({ 'headers': headers });
    return this.http.get(this.gc.buildStatus() + 'api/Profile/KeepAlive', options);
  }



}

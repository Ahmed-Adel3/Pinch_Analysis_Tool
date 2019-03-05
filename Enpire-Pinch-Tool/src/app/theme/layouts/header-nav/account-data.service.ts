import { Injectable } from '@angular/core';
import { GlobalSettingsService } from '../../../_services/global-settings.service';
import { RequestOptions, Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AccountDataService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    getData() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        return this.http.get(this.gc.buildStatus() + 'api/Profile/MenuData', options).map((res: Response) => res.json());
    }
}

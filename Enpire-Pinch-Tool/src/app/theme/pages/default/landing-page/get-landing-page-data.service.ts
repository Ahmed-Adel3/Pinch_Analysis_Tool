import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { GlobalSettingsService } from '../../../../_services/global-settings.service';

@Injectable()
export class GetLandingPageDataService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    getCases() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/Profile/GetCases', options).map((res: Response) => res.json());
    }

}

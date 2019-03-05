import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../../../../_services/global-settings.service';

@Injectable()
export class SaveCaseService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    saveCase(e) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        let body = new Object({ CaseInputs: JSON.stringify(e), CaseName: e.CaseName, CaseDescription: e.CaseDescription });
        return this.http.post(this.gc.buildStatus() + 'api/Profile/SaveCase', body, options).map((res: Response) => res.json());
    }

    saveComment(caseId, comment, chart) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        let body = new Object({ CaseId: caseId, Chart: chart, Comment: comment });
        return this.http.post(this.gc.buildStatus() + 'api/Profile/SaveChartComment', body, options).map((res: Response) => res.json());
    }


}

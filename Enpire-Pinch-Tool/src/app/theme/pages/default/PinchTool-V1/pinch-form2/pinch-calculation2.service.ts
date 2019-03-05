import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Exchanger } from './Exchanger';
import { GlobalSettingsService } from '../../../../../_services/global-settings.service'


@Injectable()
export class PinchCalculation2Service {

    constructor(private http: Http, private gc: GlobalSettingsService) {

    }
    postData(basicInfo, DutyType: number, exchangers, Utilities) {
        let hotUtilityStreams= (Utilities!==undefined && Utilities!==null)?Utilities.HotUtilities:[]
        let coldUtilityStreams=  (Utilities!==undefined && Utilities!==null)?Utilities.ColdUtilities:[]
        let body = {
            'Approach': basicInfo.Approach,
            'CaseName': basicInfo.CaseName,
            'DutyType': DutyType,
            'CaseDescription': basicInfo.CaseDescription,
            'Units': basicInfo.Units,
            'Exchangers': exchangers,
            'hotUtilityStreams': hotUtilityStreams,
            'coldUtilityStreams':  coldUtilityStreams,
            'optimize':false
        };
console.log(body)
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': headers });
        return { 'body': body, 'response': this.http.post(this.gc.buildStatus() + 'api/pinchAnalysis/postExchangers', JSON.stringify(body), options) };
    }


}

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../../../../_services/global-settings.service'


@Injectable()
export class PinchCalculationService {

    constructor(private http: Http, private gc: GlobalSettingsService) {

    }
    postData(basicInfo, hot, cold, DutyType, Utilities) {
        let hotUtilityStreams= (Utilities!==undefined && Utilities!==null)?Utilities.HotUtilities:[]
        let coldUtilityStreams=  (Utilities!==undefined && Utilities!==null)?Utilities.ColdUtilities:[]
        
        const body = {
            'hotStreams': hot,
            'coldStreams': cold,
            'Approach': basicInfo.Approach,
            'CaseName': basicInfo.CaseName,
            'CaseDescription': basicInfo.CaseDescription,
            'DutyType': DutyType,
            'Units': basicInfo.Units,
            'hotUtilityStreams': hotUtilityStreams,
            'coldUtilityStreams':  coldUtilityStreams,
            'optimize':false
        };
console.log('Body to Stream form',body)
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        const options = new RequestOptions({ 'headers': headers });
        return { 'body': body, 'response': this.http.post(this.gc.buildStatus() + 'api/pinchAnalysis/postStreams', JSON.stringify(body), options) };
    }


}

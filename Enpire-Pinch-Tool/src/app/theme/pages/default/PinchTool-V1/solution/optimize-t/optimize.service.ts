import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../../../../../_services/global-settings.service'
import { Router } from '@angular/router';

@Injectable()
export class OptimizeService {

    constructor(private http: Http, private gc: GlobalSettingsService) {

    }
    postStreamsOptimize(Body) {
        const body=Body;
        const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post(this.gc.buildStatus() + 'api/pinchAnalysis/postStreamsOptimize', JSON.stringify(body), options);
    }

    postExchangersOptimize(Body) {
        const body=Body;
        const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post(this.gc.buildStatus() + 'api/pinchAnalysis/postExchangersOptimize', JSON.stringify(body), options);
    }


}

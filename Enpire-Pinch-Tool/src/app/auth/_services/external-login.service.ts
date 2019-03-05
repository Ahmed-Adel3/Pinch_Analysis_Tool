import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../_services/global-settings.service';

@Injectable()
export class ExternalLoginService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    getExternalLoginData() {
        const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        const options = new RequestOptions({ 'headers': headers });
        return this.http.get('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86jt7wyx5a3sm0&redirect_uri=http://pinchapi.gaptech.co/api/LinkedinAccount/SaveLinkedinUser&state=987654321&scope=r_emailaddress%20r_basicprofile', options);
    }

}

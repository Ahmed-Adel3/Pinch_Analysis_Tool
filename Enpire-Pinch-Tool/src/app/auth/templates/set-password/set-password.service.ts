import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalSettingsService } from '../../../_services/global-settings.service';

@Injectable()
export class SetPasswordService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    setPass(id, pass, cpass) {

        let body = {
            id: id,
            NewPassword: pass,
            ConfirmPassword: cpass
        };

        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post(this.gc.buildStatus() + 'api/Account/SetPassword', body, options)
    }


}

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { GlobalSettingsService } from '../../../_services/global-settings.service';

@Injectable()
export class ResetPasswordService {

    newPassword;
    confirmNewPassword;

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    resetPass(mail, token, pass, cpass) {

        let body = {
            Email: mail,
            token: token,
            NewPassword: pass,
            ConfirmPassword: cpass
        };

        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post(this.gc.buildStatus() + 'api/Account/ResetPassword', body, options)
    }


}

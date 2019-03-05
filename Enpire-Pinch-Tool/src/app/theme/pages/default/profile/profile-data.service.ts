import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { GlobalSettingsService } from '../../../../_services/global-settings.service';


@Injectable()
export class ProfileDataService {



    constructor(private http: Http, private gc: GlobalSettingsService) { }

    getProfileData() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        return this.http.get(this.gc.buildStatus() + 'api/Profile/ProfileData', options).map((res: Response) => res.json());
    }

    setProfileData(data) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.post(this.gc.buildStatus() + 'api/Profile/EditProfile', data, options).map((res: Response) => res.json());
    }

    resetPassword(data) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        let body = new Object({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmNewPassword
        })

        return this.http.post(this.gc.buildStatus() + 'api/Profile/ResetPassword', body, options).map((res: Response) => res.json());
    }

    getCases() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/Profile/GetCases', options).map((res: Response) => res.json());
    }

    deleteCase(id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/Profile/DeleteCase?id=' + id, options).map((res: Response) => res.json());
    }

}

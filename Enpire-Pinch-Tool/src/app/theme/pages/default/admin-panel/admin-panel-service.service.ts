import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { GlobalSettingsService } from '../../../../_services/global-settings.service';

@Injectable()
export class AdminPanelService {

    constructor(private http: Http, private gc: GlobalSettingsService) { }

    getStatistics() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/AdminPanel/GetStatistics', options).map((res: Response) => res.json());
    }


    getAllUsers() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/AdminPanel/GetAllUsers', options).map((res: Response) => res.json());
    }

    getAllCases() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });

        return this.http.get(this.gc.buildStatus() + 'api/AdminPanel/GetAllCases', options).map((res: Response) => res.json());
    }

    changeStatus(action,id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        let body = {Id:id}

        switch (action) {
            case 'activate':
            return this.http.post(this.gc.buildStatus() + 'api/AdminPanel/ActivateUser?Id='+id,body, options).map((res: Response) => res.json());
            case 'deactivate':
            return this.http.post(this.gc.buildStatus() + 'api/AdminPanel/BlockUser?Id='+id,body, options).map((res: Response) => res.json());
        }       
    }

    deleteCase(id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let Header = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ 'headers': Header });
        let body = {Id:id}
            return this.http.post(this.gc.buildStatus() + 'api/AdminPanel/RemoveCase?Id='+id,body, options).map((res: Response) => res.json());
        }       
}

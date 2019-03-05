import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, XHRBackend, ResponseOptions } from "@angular/http";

import { User } from "../_models/index";
import { GlobalSettingsService } from "../../_services/global-settings.service";
import { json } from "d3";
import { AuthenticationService } from ".";
import { Observable } from "rxjs/Observable";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";

@Injectable()
export class UserService {
    constructor(private http: Http, private gc: GlobalSettingsService, private router: Router) {
    }

    verify() {
        return this.http.get(this.gc.buildStatus() + 'api/Account/Verify', this.jwt()).map((response: Response) => {
            let res = response.json();
            if (res === "Not Authorized") { localStorage.removeItem('currentUser'); return null }
            else if (res === "Blocked") { this.router.navigate(['pleasewait', { 'redirectTo': 'logout' }]) }
            else return res;
        });
    }

    forgotPassword(email: string) {
        return this.http.post(this.gc.buildStatus() + 'api/Account/ForgetPassword', { "Email": email })
    }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        let body = {
            UserName: user.userName,
            Email: user.email,
            Password: user.password,
            ConfirmPassword: user.rpassword,
            FirstName: user.firstName,
            lastName: user.lastName,
            Country: user.country,
            Company: user.company,
            Position: user.position
        }
        return this.http.post(this.gc.buildStatus() + 'api/Account/Register', body/*, this.jwt()*/)
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser !== undefined && currentUser.access_token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token, 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' });
            return new RequestOptions({ headers: headers });
        } else {
            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            return new RequestOptions({ headers: headers });
        }
    }
}
import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { GlobalSettingsService } from "../../_services/global-settings.service";
import { Router/*, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate */} from "@angular/router";

@Injectable()
export class AuthenticationService {

    constructor(private http: Http, private GS: GlobalSettingsService,private _router: Router,) {
    }

  /*  canActivate( route:ActivatedRouteSnapshot, state:RouterStateSnapshot) : boolean {
        return true;
    }

    checkLoggedIn():boolean {

    }*/

    login(email: string, password: string) {

        let body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('username', email);
        body.set('password', password);

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
        let options = new RequestOptions({ 'headers': headers });

        return this.http.post(this.GS.buildStatus() + 'token', body.toString(), options)
            //	return this.http.post('/api/authenticate', JSON.stringify({email: 'demo@demo.com', password: 'demo'}))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response         
                let user = response.json();

                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }


    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this._router.navigate(['/login']);
    }
}    
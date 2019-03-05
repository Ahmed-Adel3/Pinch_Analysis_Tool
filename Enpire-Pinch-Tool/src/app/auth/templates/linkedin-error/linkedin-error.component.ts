import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSettingsService } from '../../../_services/global-settings.service';

@Component({
    selector: 'app-linkedin-error',
    templateUrl: "./linkedin-error.component.html",
    styles: []
})
export class LinkedinErrorComponent implements OnInit {

    Email: string;
    ResetLink: string;

    constructor(private Arouter: ActivatedRoute, private _GS: GlobalSettingsService) {
        this.Arouter.queryParams.subscribe(a => {
            this.Email = a['Email']
        })
    }

    ngOnInit() {
        this.ResetLink = this._GS.frontStatus() + "reset-password/" + this.Email;
    }

}

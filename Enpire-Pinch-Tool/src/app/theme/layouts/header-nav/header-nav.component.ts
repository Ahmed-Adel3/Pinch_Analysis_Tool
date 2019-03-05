import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { SamplesService } from './samples.service'
import { AccountDataService } from './account-data.service';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class HeaderNavComponent implements OnInit, AfterViewInit {

    constructor(private _service: SamplesService, private _aData: AccountDataService) {
    }

    name;
    email;
    admin;

    ngOnInit() {
        this._aData.getData().subscribe(data => {
            this.name = data.userName;
            this.email = data.email;
            this.admin = data.role;
        });
    }

    ngAfterViewInit() {
        mLayout.initHeader();
    }

    V1Sample1() {
        this._service.V1Sample1();
    }
    V1Sample2() {
        this._service.V1Sample2();
    }
    V1Sample3() {
        this._service.V1Sample3();
    }

    V1Sample4() {
        this._service.V1Sample4();
    }
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDataService } from '../../../layouts/header-nav/account-data.service';


@Component({
    selector: 'admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: []
})
export class AdminPanelComponent implements OnInit {


    constructor(private router: Router,private _aData: AccountDataService) { 
        this._aData.getData().subscribe(data => {
            if(data.role !== true) {
                this.router.navigate(['pleasewait', { 'redirectTo': 'Home' }])
            }
        });
    }

    ngOnInit() {
    }

}

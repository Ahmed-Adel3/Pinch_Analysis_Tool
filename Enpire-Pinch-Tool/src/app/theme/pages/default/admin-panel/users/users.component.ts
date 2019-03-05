import { OnInit, Component,ViewChild } from "@angular/core";
import { AdminPanelService } from "../admin-panel-service.service";
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

@Component({
    selector: 'app-cases',
    templateUrl: './users.component.html',
    styles: []
})
export class UsersComponent implements OnInit {

    users: any[];
    /*cols: any[];*/

    displayedColumns = ['fullName', 'email', 'numberOfCases', 'registerDate','position','country','actions'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource;

    constructor(private APS:AdminPanelService) { }

    ngOnInit() {
        this.APS.getAllUsers().subscribe(data => {
            this.users=data;
            this.dataSource= new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })  
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }

    changeStatus(action:string,id:string) {
        let response:string='';
        switch (action) {
            case 'activate':
            this.APS.changeStatus('activate',id).subscribe(data => { response = data });
             if (response !== 'BlockingDisabled') {
                let user = this.users.find(a=>a.userId === id);
                user.isActive = true;
            }
            break;
            case 'deactivate':
            this.APS.changeStatus('deactivate',id).subscribe(data =>{response = data })
            if (response !== 'BlockingDisabled') { 
                let user = this.users.find(a=>a.userId === id);
                user.isActive = false;
            }
            break;
        }
    }
}
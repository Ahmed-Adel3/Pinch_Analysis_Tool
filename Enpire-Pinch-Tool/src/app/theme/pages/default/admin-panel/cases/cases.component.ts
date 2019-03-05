import { Component, OnInit,ViewChild } from '@angular/core';
import { AdminPanelService } from '../admin-panel-service.service';
import { LoadCaseService as LoadCaseService1 } from '../../PinchTool-V1/pinch-form/load-case.service'
import { LoadCaseService as LoadCaseService2 } from '../../PinchTool-V1/pinch-form2/load-case.service'
import { Router } from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

@Component({
    selector: 'app-cases',
    templateUrl: './cases.component.html',
    styles: []
})
export class CasesComponent implements OnInit {
    
    cases: any[];
    cols: any[];

    displayedColumns = ['caseName', 'caseDescription', 'user', 'caseDate','actions'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource;

    constructor(private APS:AdminPanelService,               
                private lc1: LoadCaseService1,
                private lc2: LoadCaseService2,
                private router: Router,) { }

    ngOnInit() {
        this.APS.getAllCases().subscribe(data => {
            this.cases= data;
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

    deleteCase(e, id) {
        this.APS.deleteCase(id).subscribe(data => { },
            error => { console.log(error) });
        this.dataSource.data = this.dataSource.data.filter(a => a.caseId !== id)
    }

    loadCase(id) {
        let jsonCase = JSON.parse(this.cases.filter(a => a.caseId === id)[0].caseData)

        if (jsonCase.hotStreams !== undefined) {
            this.lc1.case = jsonCase;
            //window.open('pinchV1/byStream')
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byStream' }]);
        } else {
            this.lc2.case = jsonCase;
            //window.open('pinchV1/byExchanger')
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byExchanger' }]);
        }
    }

}

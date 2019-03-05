import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';
import { CasesComponent } from './cases/cases.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  } from '@angular/material';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": '',
                "component": AdminPanelComponent,
                "children": [
                    {
                        "path": '',
                        "component": StatisticsComponent
                    },
                    {
                        "path": 'users',
                        "component": UsersComponent
                    },
                    {
                        "path": 'cases',
                        "component": CasesComponent
                    },
                    {
                        'path': '**',
                        'redirectTo': '',
                        'pathMatch': 'full',
                    },
                ]
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes), 
        LayoutModule,
        SweetAlert2Module.forRoot(),
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        AdminPanelComponent,
        StatisticsComponent,
        UsersComponent,
        CasesComponent
    ]
})
export class AdminPanelModule {
}
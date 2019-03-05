import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { PinchToolV1Component } from './PinchTool-V1.component';
import { PinchFormComponent } from './pinch-form/pinch-form.component';
import { PinchForm2Component } from './pinch-form2/pinch-form2.component';
import { SolutionComponent } from './solution/solution.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { PinchToolV1_ROUTES } from './PinchTool-V1.routes';
import { FormWizardModule } from 'angular2-wizard';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatTabsModule,
  } from '@angular/material';
 import { OptimizeTComponent } from './solution/optimize-t/optimize-t.component';
 import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PinchToolV1_ROUTES),
        LayoutModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        NvD3Module,
        FormWizardModule,
        MatStepperModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatStepperModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        SweetAlert2Module.forRoot()
    ],
    exports: [
        RouterModule,    
    ],
    declarations: [
        PinchToolV1Component,
        PinchFormComponent,
        PinchForm2Component,
        SolutionComponent,
        OptimizeTComponent
    ],
    providers: [],
})
export class PinchToolV1Module {
}
import { Routes } from '@angular/router';
import { PinchFormComponent } from './pinch-form/pinch-form.component';
import { PinchForm2Component } from './pinch-form2/pinch-form2.component';
import { SolutionComponent } from './solution/solution.component';

import { PinchToolV1Component } from './PinchTool-V1.component';
import { DefaultComponent } from '../default.component';

/* export const PinchToolV1_ROUTES: Routes = [
/*{ path: 'pinchV1',  redirectTo: 'pinchV1/byStream'},
{ path: 'byStream', component: PinchFormComponent },
{ path: 'byUtility', component: PinchForm2Component },
{ path: 'Solution', component: SolutionComponent}];*/

export const PinchToolV1_ROUTES: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': PinchToolV1Component,
                'children': [
                    {
                        path: 'byStream',
                        component: PinchFormComponent,
                    },
                    {
                        path: 'byExchanger',
                        component: PinchForm2Component,
                    },
                    {
                        path: 'Solution',
                        component: SolutionComponent,
                    }
                ]
            },
        ],
    },
];
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';

const routes: Routes = [
    {
        'path': '',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        'children': [
            {
                'path': 'pinchV1',
                'loadChildren': '.\/pages\/default\/PinchTool-V1\/PinchTool-V1.module#PinchToolV1Module',
            },
            /*{
                'path': 'index',
                'loadChildren': '.\/pages\/default\/blank\/blank.module#BlankModule',
            },*/
            {
                'path': 'profile',
                'loadChildren': '.\/pages\/default\/profile\/profile.module#ProfileModule',
            },
            {
                'path': 'Home',
                'loadChildren': '.\/pages\/default\/landing-page\/landing-page.module#LandingPageModule',
            },
            {
                'path': 'AdminPanel',
                'loadChildren': '.\/pages\/default\/admin-panel\/admin-panel.module#AdminPanelModule',
            }
        ],
    },
    {
        'path': '**',
        'redirectTo': 'Home',
        'pathMatch': 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThemeRoutingModule { }
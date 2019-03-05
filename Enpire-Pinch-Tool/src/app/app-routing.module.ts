import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";
import { PleaseWaitComponent } from './theme/layouts/please-wait/please-wait.component';
import { ResetPasswordComponent } from './auth/templates/reset-password/reset-password.component';
import { SetPasswordComponent } from './auth/templates/set-password/set-password.component';
import { LinkedinErrorComponent } from './auth/templates/linkedin-error/linkedin-error.component';
import { LandingPageComponent } from './theme/pages/default/landing-page/landing-page.component';

const routes: Routes = [
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'logout', component: LogoutComponent },
    { path: 'pleasewait', component: PleaseWaitComponent, pathMatch: 'full' },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'set-password/:id', component: SetPasswordComponent },
    { path: 'Linkedin_Error/:Email', component: LinkedinErrorComponent },
    { path: '', redirectTo: 'Home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
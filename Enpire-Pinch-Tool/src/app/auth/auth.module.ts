import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { ResetPasswordComponent } from './templates/reset-password/reset-password.component';
import { ResetPasswordService } from './templates/reset-password/reset-password.service'
/*import { fakeBackendProvider } from './_helpers/index';*/
import { ExternalLoginService } from './_services/external-login.service';
import { SetPasswordComponent } from './templates/set-password/set-password.component'
import { SetPasswordService } from './templates/set-password/set-password.service';
import { LinkedinErrorComponent } from './templates/linkedin-error/linkedin-error.component';

@NgModule({
    declarations: [
        AuthComponent,
        AlertComponent,
        LogoutComponent,
        ResetPasswordComponent,
        SetPasswordComponent,
        LinkedinErrorComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthRoutingModule,
        ReactiveFormsModule
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        ResetPasswordService,
        SetPasswordService,
        UserService,
        ExternalLoginService,
        // api backend simulation
        // fakeBackendProvider,
        // MockBackend,
        BaseRequestOptions,
    ],
    entryComponents: [AlertComponent],
})

export class AuthModule {
}
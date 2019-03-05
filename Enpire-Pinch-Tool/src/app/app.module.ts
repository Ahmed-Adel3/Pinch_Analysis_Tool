import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { GlobalSettingsService } from "./_services/global-settings.service"
import { SamplesService } from './theme/layouts/header-nav/samples.service';

import { PinchCalculationService } from './theme/pages/default/PinchTool-V1/pinch-form/pinch-calculation.service';
import { PinchCalculation2Service } from './theme/pages/default/PinchTool-V1/pinch-form2/pinch-calculation2.service';
import { GetSolutionService } from './theme/pages/default/PinchTool-V1/solution/get-solution.service';
import { PinchFormV1TestService } from './theme/pages/default/PinchTool-V1/pinch-form/pinch-formV1-test.service';
import { PinchForm2V1TestService } from './theme/pages/default/PinchTool-V1/pinch-form2/pinch-form2V1-test.service.ts';
import { ProfileDataService } from './theme/pages/default/profile/profile-data.service';
import { SaveCaseService } from './theme/pages/default/PinchTool-V1/solution/save-case.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { LoadCaseService as LoadCaseService1 } from './theme/pages/default/PinchTool-V1/pinch-form/load-case.service';
import { LoadCaseService as LoadCaseService2 } from './theme/pages/default/PinchTool-V1/pinch-form2/load-case.service';
import { LandingPageComponent } from './theme/pages/default/landing-page/landing-page.component';
import { GetLandingPageDataService } from './theme/pages/default/landing-page/get-landing-page-data.service';
import { AdminPanelService } from './theme/pages/default/admin-panel/admin-panel-service.service';
import { OptimizeService } from './theme/pages/default/PinchTool-V1/solution/optimize-t/optimize.service';
import { KeepAliveService } from './theme/layouts/footer/keep-alive.service';

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        SweetAlert2Module.forRoot(),
    ],
    providers: [
        ScriptLoaderService,
        GlobalSettingsService,
        SamplesService,
        PinchCalculationService,
        PinchCalculation2Service,
        GetSolutionService,
        PinchFormV1TestService,
        PinchForm2V1TestService,
        ProfileDataService,
        SaveCaseService,
        LoadCaseService1,
        LoadCaseService2,
        GetLandingPageDataService,
        AdminPanelService,
        OptimizeService,
        KeepAliveService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
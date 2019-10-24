import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DistributionsModule } from './core/components/distributions/distributions.module';

import { GenericRestClientService } from './core/services/generic-rest-client.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatTableModule, MatFormFieldModule, 
  MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { ClarityModule } from '@clr/angular';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { NewTournamentComponent } from './core/modals/new-tournament/new-tournament.component';
import { NewDistributionComponent } from './core/modals/new-distribution/new-distribution.component';
import { SetsComponent } from './core/components/sets/sets.component';
import { DistributionsComponent } from './core/components/distributions/distributions.component';
import { DistributionComponent } from './core/components/distribution/distribution.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NewTournamentComponent,
    //NewDistributionComponent,
    SetsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule, 
    MatFormFieldModule, 
    LayoutModule,
    MatToolbarModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatListModule,
    MatCardModule,
    ClarityModule,
    DistributionsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatTableModule, MatFormFieldModule, 
  MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { ClarityModule } from '@clr/angular';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
// import { RegistrationComponent } from './registration/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    //RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
    ClarityModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

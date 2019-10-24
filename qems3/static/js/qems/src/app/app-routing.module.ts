import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SetsComponent } from './core/components/sets/sets.component';
import { DistributionsComponent } from './core/components/distributions/distributions.component';
import { DistributionComponent } from './core/components/distribution/distribution.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'sets', component: SetsComponent },
  {
    path: 'distributions', 
    //component: DistributionsComponent,
    loadChildren: () => import('./core/components/distributions/distributions.module')
      .then(m => m.DistributionsModule)
  },
  //{ path: 'distributions/:id', component: DistributionComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

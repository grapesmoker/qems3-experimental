import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistributionsRoutingModule } from './distributions.routing';
import { DistributionsComponent } from './distributions.component';
import { DistributionComponent } from '../distribution/distribution.component';
import { NewDistributionComponent } from '../../../core/modals/new-distribution/new-distribution.component';

@NgModule({
    imports: [
        FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        DistributionsRoutingModule,
        ClarityModule,
    ],
    declarations: [
        
        DistributionsComponent,
        DistributionComponent,
        NewDistributionComponent
    ]
})
export class DistributionsModule {}
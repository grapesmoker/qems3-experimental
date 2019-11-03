import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistributionsRoutingModule } from './distributions.routing';
import { DistributionsComponent } from './distributions.component';
import { DistributionComponent } from '../distribution/distribution.component';
import { NewDistributionComponent } from '../../../core/modals/new-distribution/new-distribution.component';
import { StoreModule } from '@ngrx/store';
import { QemsState } from 'src/app/types';
import { distributionReducer } from './store/reducers/distribution.reducer'
import { distributionsReducer } from './store/reducers/distributions.reducer'
import { EffectsModule } from '@ngrx/effects';
import { DistributionsEffects } from './distributions.effects';

@NgModule({
    imports: [
        FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        DistributionsRoutingModule,
        ClarityModule,
        StoreModule.forFeature('distributions', distributionsReducer),
        EffectsModule.forFeature([DistributionsEffects])
    ],
    declarations: [
        
        DistributionsComponent,
        DistributionComponent,
        NewDistributionComponent
    ]
})
export class DistributionsModule {}
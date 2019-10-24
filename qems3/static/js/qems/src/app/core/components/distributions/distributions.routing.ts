import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DistributionsComponent } from './distributions.component';
import { DistributionComponent } from '../distribution/distribution.component';

const routes: Routes = [
    {
        path: '',
        component: DistributionsComponent,
        children: [
            {
                path: ':id',
                component: DistributionComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DistributionsRoutingModule {}

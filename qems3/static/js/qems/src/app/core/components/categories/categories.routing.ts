import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryComponent } from './category.component';
import { CategoriesComponent } from './categories.component'

const routes: Routes = [
    {
        path: '',
        component: CategoriesComponent,
        children: [
            {
                path: ':id',
                component: CategoryComponent
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
export class CategoriesRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoriesRoutingModule } from './categories.routing';
import { CategoriesComponent } from './categories.component';
import { CategoryComponent } from './category.component';
import { NewCategoryComponent } from '../../../core/modals/new-category/new-category.component'

import { categoriesReducer } from './store/reducers/categories.reducer'
import { CategoriesEffects } from './store/effects/categories.effects';

@NgModule({
    imports: [
        FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        CategoriesRoutingModule,
        ClarityModule,
        StoreModule.forFeature('categories', categoriesReducer),
        EffectsModule.forFeature([CategoriesEffects])
    ],
    declarations: [
        CategoriesComponent,
        CategoryComponent,
        NewCategoryComponent
    ]
})
export class CategoriesModule {}
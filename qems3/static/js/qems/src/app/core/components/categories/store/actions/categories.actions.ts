import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Category } from 'src/app/core/types/models';


export const getCategories = createAction(
    '[Categories Page] Load Categories'
);

export const getCategoriesSuccess = createAction(
    '[Categories Page] Load Success',
    props<{categories: Category[]}>()
);

export const updateCategory = createAction(
    '[Distribution Page] Save',
    props<{category: Update<Category>}>()
);
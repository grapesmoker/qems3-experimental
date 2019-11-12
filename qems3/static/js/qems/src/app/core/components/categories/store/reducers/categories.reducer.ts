import { createReducer, on, StateObservable } from '@ngrx/store';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

import { updateCategory } from '../actions/categories.actions';
import { getCategories, getCategoriesSuccess } from '../actions/categories.actions';
import { Category } from 'src/app/core/types/models';


export interface CategoriesState extends EntityState<Category> {}
export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>()
export const initialState = adapter.getInitialState()

const _categoriesReducer = createReducer(
    initialState,
    on(getCategoriesSuccess, (state, { categories }) => {
        return adapter.upsertMany(categories, state)
    }),
    on(updateCategory, (state, {category}) => {
        return adapter.updateOne(category, state)
    })
)

export function categoriesReducer(state, action) {
    return _categoriesReducer(state, action)
}

const {
    selectAll,
    selectEntities,
    selectTotal,
    selectIds
} = adapter.getSelectors()

export const selectAllCategories = selectAll
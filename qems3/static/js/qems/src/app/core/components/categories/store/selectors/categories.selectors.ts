import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { QemsState, Distribution } from '../../../../types/models';
import { selectAllCategories, CategoriesState } from '../reducers/categories.reducer'

export const _selectCategories = createFeatureSelector<CategoriesState>(
    'categories'
)


export const selectCategories = createSelector(
    _selectCategories,
    selectAllCategories
 )
import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { QemsState, Distribution } from 'src/app/types';
import { selectAllDistributions, DistState } from '../reducers/distributions.reducer'

export const _selectDistributions = createFeatureSelector<DistState>(
    'distributions'
)


export const selectDistributions = createSelector(
    _selectDistributions,
    selectAllDistributions
 )
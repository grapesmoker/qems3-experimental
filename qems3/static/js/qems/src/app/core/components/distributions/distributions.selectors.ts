import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { QemsState, Distribution } from 'src/app/types';
import { distributionsReducer } from './distributions.reducer'

export const _selectDistributions = createFeatureSelector<QemsState>(
    'distributions'
)

export const selectDistributions = createSelector(
    _selectDistributions,
    //(state: QemsState) => state.distributions
    distributionsReducer
 )
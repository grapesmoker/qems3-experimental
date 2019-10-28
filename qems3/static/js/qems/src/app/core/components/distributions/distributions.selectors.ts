import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, Distribution } from 'src/app/types';

export const _selectDistributions = createFeatureSelector<State>(
    'distributions'
)

export const selectDistributions = createSelector(
    _selectDistributions,
    (state: State) => state.distributions
 )
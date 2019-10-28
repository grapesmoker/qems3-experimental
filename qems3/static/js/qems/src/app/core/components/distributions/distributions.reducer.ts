import { createReducer, on, StateObservable } from '@ngrx/store';
import { saveDistribution } from '../distribution/distribution.actions';
import { getDistributions, getDistributionsSuccess } from './distributions.actions';
import { State, Distribution } from 'src/app/types';


export const initialState: State = {
    user: null,
    distributions: []
};

const _distributionsReducer = createReducer(
    initialState,
    on(getDistributionsSuccess, (state, { dists }) => ({
        ...state, distributions: dists
    })),
    on(saveDistribution, (state, {dist }) => ({
        ...state, distributions: state.distributions.map(
            item => item.id === dist.id ? dist : item)
    }))
)

export function distributionsReducer(state, action) {
    return _distributionsReducer(state, action)
}

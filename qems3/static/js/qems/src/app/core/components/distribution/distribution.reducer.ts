import { createReducer, on } from '@ngrx/store';
import { saveDistribution } from './distribution.actions';
import { State, Distribution } from 'src/app/types';


export const initialState: State = {
    distributions: []
};

const _distributionReducer = createReducer(
    initialState,
    on(saveDistribution, (state, { dist }) => ({
        ...state, distributions: state.distributions.map(
            item => item.id === dist.id ? dist : item
        )}
    ))
)

export function distributionReducer(state, action) {
    return _distributionReducer(state, action)
}
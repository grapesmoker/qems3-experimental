import { createReducer, on, StateObservable } from '@ngrx/store';
import { updateDistribution } from '../actions/distributions.actions';
import { getDistributions, getDistributionsSuccess } from '../actions/distributions.actions';
import { QemsState, Distribution } from '../../../../types/models';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

export interface DistState extends EntityState<Distribution> {}
export const distAdapter: EntityAdapter<Distribution> = createEntityAdapter<Distribution>()
export const initialState = distAdapter.getInitialState()

const _distributionsReducer = createReducer(
    initialState,
    on(getDistributionsSuccess, (state, { dists }) => {
        return distAdapter.upsertMany(dists, state)
    }),
    on(updateDistribution, (state, {dist}) => {
        return distAdapter.updateOne(dist, state)
    })
)

export function distributionsReducer(state, action) {
    return _distributionsReducer(state, action)
}

const {
    selectAll
} = distAdapter.getSelectors()

export const selectAllDistributions = selectAll
import { createReducer, on, StateObservable } from '@ngrx/store';
import { updateDistribution } from './distributions.actions';
import { getDistributions, getDistributionsSuccess } from './distributions.actions';
import { QemsState, Distribution } from 'src/app/types';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Distribution> {}
export const distAdapter: EntityAdapter<Distribution> = createEntityAdapter<Distribution>()
export const initialState = distAdapter.getInitialState()

// export const initialState: QemsState = {
//     user: null,
//     distributions: []
// };

const _distributionsReducer = createReducer(
    initialState,
    on(getDistributionsSuccess, (state, { dists }) => {
        return distAdapter.upsertMany(dists, state)
    }),
    on(updateDistribution, (state, {dist}) => {
        console.log('updating distribution')
        console.log(distAdapter.updateOne(dist, state))
        return distAdapter.updateOne(dist, state)
    })
)

export function distributionsReducer(state, action) {
    return _distributionsReducer(state, action)
}

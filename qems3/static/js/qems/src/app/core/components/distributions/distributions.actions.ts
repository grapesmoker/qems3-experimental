import { createAction, props } from '@ngrx/store';
import { Distribution } from 'src/app/types';


export const getDistributions = createAction(
    '[Distributions Page] Load Distributions'
);

export const getDistributionsSuccess = createAction(
    '[Distributions Page] Load Success',
    props<{dists: Distribution[]}>()
);

export const saveDistribution = createAction(
    '[Distribution Page] Save',
    props<{dist: Distribution}>()
);
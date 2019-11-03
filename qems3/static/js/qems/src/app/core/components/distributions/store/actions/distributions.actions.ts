import { createAction, props } from '@ngrx/store';
import { Distribution } from 'src/app/types';
import { Update } from '@ngrx/entity';


export const getDistributions = createAction(
    '[Distributions Page] Load Distributions'
);

export const getDistributionsSuccess = createAction(
    '[Distributions Page] Load Success',
    props<{dists: Distribution[]}>()
);

export const updateDistribution = createAction(
    '[Distribution Page] Save',
    props<{dist: Update<Distribution>}>()
);
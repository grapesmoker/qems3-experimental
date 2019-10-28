import { createAction, props } from '@ngrx/store';
import { Distribution } from 'src/app/types';


export const saveDistribution = createAction(
    '[Distribution Page] Save',
    props<{dist: Distribution}>()
);
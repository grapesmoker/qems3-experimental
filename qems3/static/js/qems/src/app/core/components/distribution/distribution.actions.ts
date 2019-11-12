import { createAction, props } from '@ngrx/store';
import { Distribution } from '../../types/models';
import { Update } from '@ngrx/entity';

export const saveDistribution = createAction(
    '[Distribution Page] Old Save',
    props<{dist: Update<Distribution>}>()
);
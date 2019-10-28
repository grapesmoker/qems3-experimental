import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DistributionService } from '../../services/distribution.service'


@Injectable()
export class DistributionsEffects {

    constructor(
        private actions$: Actions,
        private distributionService: DistributionService
    ) {}

    loadDistributions$ = createEffect(() => this.actions$.pipe(
        ofType('[Distributions Page] Load Distributions'),
        mergeMap(() => this.distributionService.getItems()
            .pipe(
                map(results => ({type: '[Distributions Page] Load Success', 
                    dists: results})),
                catchError(() => of({type: 'oh noes'}))
            )
        )
    ))
   
}
import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CategoryService } from '../../../../services/categories.service'


@Injectable()
export class CategoriesEffects {

    constructor(
        private actions$: Actions,
        private CategoryService: CategoryService
    ) {}

    loadCategorys$ = createEffect(() => this.actions$.pipe(
        ofType('[Categories Page] Load Categories'),
        mergeMap(() => this.CategoryService.getItems()
            .pipe(
                map(results => ({type: '[Categories Page] Load Success', 
                    categories: results})),
                catchError(() => of({type: 'oh noes'}))
            )
        )
    ))
   
}
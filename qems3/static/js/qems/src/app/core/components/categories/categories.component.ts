import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NewCategoryComponent } from '../../modals/new-category/new-category.component'
import { Observable } from 'rxjs';
import { Category } from '../../types/models';
import { CategoryService } from '../../services/categories.service'
import { QemsState } from '../../types/models';
import { Store, select } from '@ngrx/store'
import { updateCategory } from './store/actions/categories.actions';
import { selectCategories } from './store/selectors/categories.selectors';
import { getCategories } from './store/actions/categories.actions'


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements AfterViewInit {

  constructor(
    private categoryService: CategoryService,
    private store: Store<QemsState>
  ) { 
    this.categories$ = this.store.pipe(select(selectCategories))
  }

  ngOnInit() {
    this.store.dispatch(getCategories())
  }

  categories$: Observable<Category[]>;

  @ViewChild(NewCategoryComponent, {static: false}) modal: NewCategoryComponent;

  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(category => {
      this.categoryService.postItem(category).subscribe(response => {
        //this.store.dispatch(updateCategory({category: response}))
      });
    });
  }
}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs';
import { Category, QemsState } from 'src/app/core/types/models'
import { selectCategories } from '../../components/categories/store/selectors/categories.selectors'
import { Store, select } from '@ngrx/store'

@Component({
  selector: 'new-category-modal',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.sass']
})
export class NewCategoryComponent implements OnInit {

  show: boolean = false;
  categories$: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<QemsState>
  ) { }

  categoryForm = this.fb.group({
    name: [''],
    description: [''],
    parentCategory: ['']
  })

  @Output() onOk: EventEmitter<Category> = new EventEmitter<Category>();

  ngOnInit() {
    this.categories$ = this.store.pipe(select(selectCategories))
  }

  open() {
    this.show = true;
    console.log("opening")
  }

  onCancel() {
    this.show = false;
    console.log("clicked cancel")
  }

  onSubmit() {
    this.show = false;
    let category: Category = {
      name: this.categoryForm.controls['name'].value,
      description: this.categoryForm.controls['description'].value,
      parent_category: this.categoryForm.controls['parentCategory'].value
    }

    this.onOk.emit(category);
  }
}

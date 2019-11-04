import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Category } from 'src/app/core/types/models'


@Component({
  selector: 'new-category-modal',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.sass']
})
export class NewCategoryComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  categoryForm = this.fb.group({
    name: [''],
    description: [''],
    parentCategory: ['']
  })

  @Output() onOk: EventEmitter<Category> = new EventEmitter<Category>();

  ngOnInit() {
  }

}

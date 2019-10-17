import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NewDistributionComponent } from '../../modals/new-distribution/new-distribution.component';
import { Distribution } from '../../../types';


@Component({
  selector: 'app-distributions',
  templateUrl: './distributions.component.html',
  styleUrls: ['./distributions.component.sass']
})
export class DistributionsComponent implements AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild(NewDistributionComponent) modal: NewDistributionComponent;

  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(distribution => {
      console.log(distribution);
    });
  }
}

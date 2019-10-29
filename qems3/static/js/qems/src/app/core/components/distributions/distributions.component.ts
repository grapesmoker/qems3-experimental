import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NewDistributionComponent } from '../../modals/new-distribution/new-distribution.component';
import { Distribution, QemsState } from '../../../types';
import { DistributionService } from '../../services/distribution.service'
import { DistributionComponent } from '../distribution/distribution.component';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { updateDistribution, getDistributions } from './distributions.actions';
import { selectDistributions } from './distributions.selectors';
import { EntityState } from '@ngrx/entity';


@Component({
  selector: 'app-distributions',
  templateUrl: './distributions.component.html',
  styleUrls: ['./distributions.component.sass']
})
export class DistributionsComponent implements AfterViewInit {

  constructor(
    private distributionService: DistributionService,
    private store: Store<QemsState>
  ) { 
    this.distributions = this.store.pipe(select(selectDistributions))
  }

  distributions: Observable<EntityState<Distribution[]>>;
  selectedDist: Distribution;

  ngOnInit() {
    this.store.dispatch(getDistributions())
  }

  @ViewChild(NewDistributionComponent, {static: false}) modal: NewDistributionComponent;


  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(distribution => {
      this.distributionService.postItem(distribution).subscribe(response => {
        //this.store.dispatch(updateDistribution({dist: response}))
      });
    });

  }

  getDistributions() {
    return this.distributionService.getItems();
  }

  log (data) {
    console.log(data)
  }
}

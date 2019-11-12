import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NewDistributionComponent } from '../../modals/new-distribution/new-distribution.component';
import { Distribution, QemsState } from '../../types/models';
import { DistributionService } from '../../services/distribution.service'
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getDistributions } from './store/actions/distributions.actions';
import { selectDistributions } from './store/selectors/distributions.selectors';


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

  distributions: Observable<Distribution[]>;
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

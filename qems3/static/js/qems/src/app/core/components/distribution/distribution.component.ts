import { Component, OnInit, EventEmitter } from '@angular/core';
import { DistributionService } from '../../services/distribution.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Distribution, State } from 'src/app/types';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveDistribution } from '../distributions/distributions.actions';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.sass']
})
export class DistributionComponent implements OnInit {

  onUpdate: EventEmitter<Distribution> = new EventEmitter();

  distributionForm = new FormGroup({
    name: new FormControl(''),
    tossups_per_packet: new FormControl(''),
    bonuses_per_packet: new FormControl('')
  })

  constructor(
    private route: ActivatedRoute,
    private distributionService: DistributionService,
    private store: Store<State>
  ) { }

  distribution: Distribution;

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      this.distributionService.getItem({id: paramMap.get('id')})
      .subscribe(distribution => {
        this.distribution = distribution;
        this.distributionForm.patchValue(this.distribution)
        console.log(this.distribution)
      })
    })
  }

  save() {
    console.log(this.distributionForm.value)
    this.distributionService.putItem(this.distributionForm.value,
      {
        id: this.distribution.id}).subscribe(response => {
        this.store.dispatch(saveDistribution({dist: response}))
      })
  }
}

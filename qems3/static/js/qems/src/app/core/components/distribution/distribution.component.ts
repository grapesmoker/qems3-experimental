import { Component, OnInit, EventEmitter } from '@angular/core';
import { DistributionService } from '../../services/distribution.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Distribution, QemsState } from 'src/app/types';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateDistribution } from '../distributions/store/actions/distributions.actions';
import { Update } from '@ngrx/entity';

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
    private store: Store<QemsState>
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
          const distUpdate: Update<Distribution> = {
            id: response.id,
            changes: {
              name: response.name,
              tossups_per_packet: response.tossups_per_packet,
              bonuses_per_packet: response.bonuses_per_packet
            }
          }
        this.store.dispatch(updateDistribution({dist: distUpdate}))
      })
  }
}

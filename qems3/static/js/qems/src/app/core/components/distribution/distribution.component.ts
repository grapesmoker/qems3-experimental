import { Component, OnInit } from '@angular/core';
import { DistributionService } from '../../services/distribution.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Distribution } from 'src/app/types';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.sass']
})
export class DistributionComponent implements OnInit {

  distributionForm = new FormGroup({
    name: new FormControl(''),
    tossups_per_packet: new FormControl(''),
    bonuses_per_packet: new FormControl('')
  })

  constructor(
    private route: ActivatedRoute,
    private distributionService: DistributionService
  ) { }

  distribution: Distribution;
  id: number = 1;

  ngOnInit() {

    // this.distributionService.getItem({'id': this.id})
    //   .subscribe(distribution => {
    //     this.distribution = distribution;
    //   }) 
    this.route.paramMap.subscribe(paramMap => {
      this.distributionService.getItem({id: paramMap.get('id')})
      .subscribe(distribution => {
        this.distribution = distribution;
        this.distributionForm.patchValue(this.distribution)
        console.log(this.distribution)
      })
    })
  }

}

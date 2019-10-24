import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NewDistributionComponent } from '../../modals/new-distribution/new-distribution.component';
import { Distribution } from '../../../types';
import { DistributionService } from '../../services/distribution.service'
import { DistributionComponent } from '../distribution/distribution.component';

@Component({
  selector: 'app-distributions',
  templateUrl: './distributions.component.html',
  styleUrls: ['./distributions.component.sass']
})
export class DistributionsComponent implements AfterViewInit {

  constructor(
    private distributionService: DistributionService
  ) { }

  distributions: Distribution[];
  selectedDist: Distribution;

  ngOnInit() {
    this.getDistributions();
  }

  @ViewChild(NewDistributionComponent, {static: false}) modal: NewDistributionComponent;
  //@ViewChild(Distribution) dist: DistributionComponent;


  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(distribution => {
      console.log(distribution);
      this.distributionService.postItem(distribution).subscribe(result => {
        console.log(result);
      });
    });

    // this.dist.onUpdate.subscribe(Distribution => {
    //   this.getDistributions()
    // })
  }

  getDistributions() {
    this.distributionService.getItems().subscribe(distributions => {
      this.distributions = distributions;
      console.log(this.distributions);
    })
  }
}

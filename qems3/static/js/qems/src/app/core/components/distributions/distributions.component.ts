import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NewDistributionComponent } from '../../modals/new-distribution/new-distribution.component';
import { Distribution } from '../../../types';
import { DistributionService } from '../../services/distribution.service'

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
    this.distributionService.getItems().subscribe(distributions => {
      this.distributions = distributions;
      console.log(this.distributions);
    })
  }

  @ViewChild(NewDistributionComponent) modal: NewDistributionComponent;

  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(distribution => {
      console.log(distribution);
      this.distributionService.postItem(distribution).subscribe(result => {
        console.log(result);
      });
    });
  }
}

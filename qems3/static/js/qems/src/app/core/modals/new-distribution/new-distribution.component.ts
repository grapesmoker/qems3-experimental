import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Distribution } from '../../types/models';

@Component({
  selector: 'new-distribution-modal',
  templateUrl: './new-distribution.component.html',
  styleUrls: ['./new-distribution.component.sass']
})
export class NewDistributionComponent implements OnInit {

  show: boolean = false;
  name = new FormControl('', Validators.required);
  tossupsPerPacket = new FormControl('20', [Validators.required, Validators.min(1), Validators.max(1000)]);
  bonusesPerPacket = new FormControl('20', [Validators.required, Validators.min(0), Validators.max(1000)]);

  @Output() onOk: EventEmitter<Distribution> = new EventEmitter<Distribution>();

  constructor() { }

  ngOnInit() {
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
    var distribution: Distribution = {name: this.name.value, 
      tossups_per_packet: this.tossupsPerPacket.value,
      bonuses_per_packet: this.bonusesPerPacket.value}

    this.onOk.emit(distribution);
  }
}

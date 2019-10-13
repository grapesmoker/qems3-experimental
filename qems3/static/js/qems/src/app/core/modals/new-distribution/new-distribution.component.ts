import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'new-distribution-modal',
  templateUrl: './new-distribution.component.html',
  styleUrls: ['./new-distribution.component.sass']
})
export class NewDistributionComponent implements OnInit {

  show: boolean = false;
  name = new FormControl('', Validators.required);
  tossupsPerPeriodCount = new FormControl('', Validators.required);
  bonusesPerPeriodCount = new FormControl('', Validators.required);

  @Output() onOk: EventEmitter<string> = new EventEmitter<string>();

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
    this.onOk.emit("clicked submit");
  }
}

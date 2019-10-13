import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { QuestionSet } from '../../../types';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'new-tournament-modal',
  templateUrl: './new-tournament.component.html',
  styleUrls: ['./new-tournament.component.sass']
})
export class NewTournamentComponent implements OnInit {

  show: boolean = false;
  name = new FormControl('');
  dueDate = new FormControl('');
  numberOfPackets = new FormControl();
  distribution = new FormControl();

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

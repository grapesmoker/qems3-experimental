import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrls: ['./new-tournament.component.sass']
})
export class NewTournamentComponent implements OnInit {

  @Output() onOk: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  open() {

  }

  onSubmit() {
    this.onOk.emit("clicked submit");
  }

}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NewTournamentComponent } from '../../modals/new-tournament/new-tournament.component';
import { QuestionSet } from '../../../types';


@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.sass']
})
export class SetsComponent implements AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild(NewTournamentComponent) modal: NewTournamentComponent;

  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(questionSet => {
      console.log(questionSet);
    });
  }

}

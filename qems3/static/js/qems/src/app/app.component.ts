import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NewTournamentComponent } from './core/modals/new-tournament/new-tournament.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  title = 'qems';

  @ViewChild(NewTournamentComponent) modal: NewTournamentComponent;

  ngAfterViewInit(): void {
    this.modal.onOk.subscribe(questionSet => {
      console.log(questionSet);
    });
  }
}

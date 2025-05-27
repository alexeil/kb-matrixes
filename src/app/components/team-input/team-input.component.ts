import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-team-input',
  templateUrl: './team-input.component.html',
  styleUrls: ['./team-input.component.sass']
})
export class TeamInputComponent {
  teamName = '';
  teams: string[] = [];

  @Output() teamsChange = new EventEmitter<string[]>();

addTeam() {
  if (this.teamName.trim()) {
    this.teams = [...this.teams, this.teamName.trim()]; // create new array
    this.teamName = '';
    this.teamsChange.emit(this.teams);
  }
}

removeTeam(index: number) {
  this.teams = this.teams.filter((_, i) => i !== index); // create new array
  this.teamsChange.emit(this.teams);
}
}

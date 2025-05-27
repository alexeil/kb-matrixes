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
      this.teams.push(this.teamName.trim());
      this.teamName = '';
      this.teamsChange.emit(this.teams);
    }
  }

  removeTeam(index: number) {
    this.teams.splice(index, 1);
    this.teamsChange.emit(this.teams);
  }
}

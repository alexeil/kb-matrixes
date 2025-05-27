import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-input',
  templateUrl: './team-input.component.html',
  styleUrls: ['./team-input.component.sass']
})
export class TeamInputComponent implements OnInit {
  teamName = '';
  teams: string[] = [];

  @Output() teamsChange = new EventEmitter<string[]>();

  ngOnInit() {
    this.teamsChange.emit(this.teams); // Emit default teams on load
  }

  addTeam() {
    if (this.teamName.trim()) {
      this.teams = [...this.teams, this.teamName.trim()];
      this.teamName = '';
      this.teamsChange.emit(this.teams);
    }
  }

  removeTeam(index: number) {
    this.teams = this.teams.filter((_, i) => i !== index);
    this.teamsChange.emit(this.teams);
  }

  shuffleTeams() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.teams[i], this.teams[j]] = [this.teams[j], this.teams[i]];
    }
    this.teamsChange.emit(this.teams);
  }

  setTestData() {
    this.teams = ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'];
    this.teamsChange.emit(this.teams);
  }
}
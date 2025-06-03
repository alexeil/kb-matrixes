import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CategoryStateService } from '../../services/category-state.service';

@Component({
  selector: 'app-team-input',
  standalone: true,
  templateUrl: './team-input.component.html',
  styleUrls: ['./team-input.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ]
})
export class TeamInputComponent {
  teamName = '';
  @Input() teams: string[] = [];
  @Input() catIndex!: number;

  constructor(private catState: CategoryStateService) {}

  addTeam() {
    if (this.teamName.trim()) {
      const newTeams = [...this.teams, this.teamName.trim()];
      this.teamName = '';
      this.catState.updateCategory(this.catIndex, {
        ...this.catState.categories[this.catIndex],
        teams: newTeams
      });
    }
  }

  removeTeam(index: number) {
    const newTeams = this.teams.filter((_, i) => i !== index);
    this.catState.updateCategory(this.catIndex, {
      ...this.catState.categories[this.catIndex],
      teams: newTeams
    });
  }

  shuffleTeams() {
    const newTeams = [...this.teams];
    for (let i = newTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTeams[i], newTeams[j]] = [newTeams[j], newTeams[i]];
    }
    this.catState.updateCategory(this.catIndex, {
      ...this.catState.categories[this.catIndex],
      teams: newTeams
    });
  }
}
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MATCH_MATRICES } from '../../utils/matrixes.data';
import { CategoryStateService } from '../../services/category-state.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})
export class MatrixComponent implements OnChanges {
  @Input() teams: string[] = [];
  @Input() catIndex!: number;
  displayMatrix: (string | number)[][] = [];

  constructor(private catState: CategoryStateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teams']) {
      this.generateDisplayMatrix();
      // Update the matrix in the service for this category
      this.catState.updateCategory(this.catIndex, {
        ...this.catState.categories[this.catIndex],
        displayMatrix: [...this.displayMatrix]
      });
    }
  }

  generateDisplayMatrix() {
    const matrix = MATCH_MATRICES[this.teams.length];
    if (!matrix || !matrix[1]) {
      this.displayMatrix = [];
      return;
    }
    this.displayMatrix = matrix[1].map((row, i) => [
      i + 1,
      ...row.map((teamNum: number) => this.teams[teamNum - 1])
    ]);
  }
}
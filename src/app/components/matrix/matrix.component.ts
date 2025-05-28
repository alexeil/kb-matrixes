import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryStateService } from '../../services/category-state.service';
import { MATCH_MATRICES } from '../../utils/matrixes.data';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})
export class MatrixComponent implements OnInit, OnChanges {
  @Input() teams: string[] = [];
  @Input() catIndex!: number;
  numberOfFields: number = 1;
  displayMatrix: (string | number)[][] = [];

  constructor(private catState: CategoryStateService) { }

  ngOnInit() {
    const cat = this.catState.categories[this.catIndex];
    if (cat && cat.numberOfFields) {
      this.numberOfFields = cat.numberOfFields;
    }
    this.updateMatrix();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teams']) {
      this.updateMatrix();
      this.catState.updateCategory(this.catIndex, {
        ...this.catState.categories[this.catIndex],
        displayMatrix: [...this.displayMatrix]
      });
    }
  }

  onNumberOfFieldsChange() {
    this.updateMatrix();
    this.catState.updateCategory(this.catIndex, {
      ...this.catState.categories[this.catIndex],
      numberOfFields: this.numberOfFields,
      displayMatrix: [...this.displayMatrix]
    });
  }

  updateMatrix() {
    const matrixSet = MATCH_MATRICES[this.teams.length];
    if (!matrixSet || !matrixSet[this.numberOfFields]) {
      this.displayMatrix = [];
      return;
    }
    this.displayMatrix = matrixSet[this.numberOfFields].map((row, i) => [
      i + 1,
      ...row.map((teamNum: number) => this.teams[teamNum - 1])
    ]);
  }
}
import { Component } from '@angular/core';
import { CategoryStateService } from './services/category-state.service';
import { Category } from './models/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  categories: Category[] = [];
  selectedCategoryIndex = 0;
  mainTabIndex = 0;
  scheduleStart: string = '10:00';
  scheduleInterval: number = 45; // in minutes
  scheduleFields: number = 1;

  lang: 'en' | 'cz' = 'en';
  teamLabels = ['M', 'B', 'Č'];

  constructor(public catState: CategoryStateService) {
    let previousLength = 0;
    this.catState.categories$.subscribe(cats => {
      // If a category was added, select the last one
      if (cats.length > previousLength) {
        this.selectedCategoryIndex = cats.length - 1;
      }
      // Ensure selectedCategoryIndex is valid
      if (this.selectedCategoryIndex >= cats.length) {
        this.selectedCategoryIndex = Math.max(0, cats.length - 1);
      }
      this.categories = cats;
      previousLength = cats.length;
    });
  }

  get selectedCategory() {
    console.log('Selected category index:', this.selectedCategoryIndex);
    return this.categories[this.selectedCategoryIndex];
  }

  onTeamsChange(newTeams: string[], catIndex: number) {
    const cat = this.categories[catIndex];
    if (JSON.stringify(cat.teams) !== JSON.stringify(newTeams)) {
      this.catState.updateCategory(catIndex, { ...cat, teams: [...newTeams] });
    }
  }

  onDisplayMatrixChange(matrix: (string | number)[][], catIndex: number) {
    const cat = this.categories[catIndex];
    if (JSON.stringify(cat.displayMatrix) !== JSON.stringify(matrix)) {
      this.catState.updateCategory(catIndex, { ...cat, displayMatrix: [...matrix] });
    }
  }

  addCategory() {
    this.catState.addCategory();
    //this.selectedCategoryIndex = this.categories.length; // Will be corrected by subscription
  }

  removeCategory(index: number) {
    this.catState.removeCategory(index);
    // selectedCategoryIndex will be corrected by subscription
  }

  trackByCategoryId(index: number, cat: Category) {
    return cat.id;
  }

  setTestData() {
    const categories: Category[] = [
      {
        id: Date.now() + Math.random(),
        name: 'Category A',
        teams: ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'],
        numberOfFields: 1,
        displayMatrix: []
      },
      {
        id: Date.now() + Math.random(),
        name: 'Category B',
        teams: ['Olomouc', 'Liberec', 'Ostrava', 'Zlín', 'Jihlava', 'Karlovy Vary'],
        numberOfFields: 1,
        displayMatrix: []
      }
    ];
    this.catState.setCategories(categories);
    this.selectedCategoryIndex = 0;
  }
}
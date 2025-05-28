import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryStateService {
  private categoriesSubject = new BehaviorSubject<Category[]>([
    {
      id: Date.now() + Math.random(),
      name: 'Category 1',
      teams: [],
      displayMatrix: []
    }
  ]);
  categories$ = this.categoriesSubject.asObservable();

  get categories(): Category[] {
    return this.categoriesSubject.value;
  }

  setCategories(categories: Category[]) {
    this.categoriesSubject.next([...categories]);
  }

  updateCategory(index: number, updated: Category) {
    const arr = [...this.categories];
    arr[index] = { ...updated };
    this.setCategories(arr);
  }

  addCategory() {
    const arr = [
      ...this.categories,
      {
        id: Date.now() + Math.random(),
        name: 'New Category',
        teams: [],
        displayMatrix: [],
        scheduleStart: '10:00',
        scheduleInterval: 45
      }
    ];
    this.setCategories(arr);
  }

  removeCategory(index: number) {
    const arr = this.categories.filter((_, i) => i !== index);
    this.setCategories(arr);
  }
}
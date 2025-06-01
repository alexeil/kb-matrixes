import { TestBed } from '@angular/core/testing';
import { CategoryStateService } from './category-state.service';
import { Category } from '../models/category';

describe('CategoryStateService', () => {
  let service: CategoryStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set categories', () => {
    const cats: Category[] = [
      { id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 },
      { id: 2, name: 'B', teams: [], displayMatrix: [], numberOfFields: 1 }
    ];
    service.setCategories(cats);
    expect(service.categories.length).toBe(2);
    expect(service.categories[0].name).toBe('A');
  });

  it('should add a category', () => {
    service.setCategories([]);
    service.addCategory();
    expect(service.categories.length).toBe(1);
    expect(service.categories[0].name).toBe('New Category');
  });

  it('should update a category', () => {
    service.setCategories([
      { id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }
    ]);
    service.updateCategory(0, { id: 1, name: 'Updated', teams: ['T1'], displayMatrix: [], numberOfFields: 2 });
    expect(service.categories[0].name).toBe('Updated');
    expect(service.categories[0].teams).toEqual(['T1']);
    expect(service.categories[0].numberOfFields).toBe(2);
  });

  it('should remove a category', () => {
    service.setCategories([
      { id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 },
      { id: 2, name: 'B', teams: [], displayMatrix: [], numberOfFields: 1 }
    ]);
    service.removeCategory(0);
    expect(service.categories.length).toBe(1);
    expect(service.categories[0].name).toBe('B');
  });
});

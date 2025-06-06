import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { GameSheetComponent } from './components/game-sheet/game-sheet.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, ScheduleComponent, GameSheetComponent],
      imports: [
        CommonModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        DragDropModule
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should add and remove categories', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([]);
    app.addCategory();
    expect(app.categories.length).toBe(1);
    app.addCategory();
    expect(app.categories.length).toBe(2);
    app.removeCategory(0);
    expect(app.categories.length).toBe(1);
  });

  it('should update teams and displayMatrix', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: ['A'], displayMatrix: [], numberOfFields: 1 }]);
    app.onTeamsChange(['A', 'B'], 0);
    expect(app.categories[0].teams).toEqual(['A', 'B']);
    app.onDisplayMatrixChange([[1, 'A', 'B', 'C']], 0);
    expect(app.categories[0].displayMatrix).toEqual([[1, 'A', 'B', 'C']]);
  });

  it('should set test data', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setTestData();
    expect(app.categories.length).toBe(2);
    expect(app.selectedCategoryIndex).toBe(0);
  });

  it('should encode and decode unicode base64', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const str = 'ěščřžýáíé漢字';
    const encoded = app.btoaUnicode(str);
    const decoded = app.atobUnicode(encoded);
    expect(decoded).toBe(str);
  });

  it('should copy share url', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: ['A'], displayMatrix: [], numberOfFields: 1 }]);
    // Use spyOnProperty to mock clipboard with all required methods
    const fakeClipboard = {
      writeText: jasmine.createSpy('writeText'),
      read: () => Promise.resolve(),
      readText: () => Promise.resolve(''),
      write: () => Promise.resolve(),
      addEventListener: () => { /* intentionally empty */ },
      removeEventListener() { /* intentionally empty */ }, // intentionally empty
      dispatchEvent: () => true
    };
    spyOnProperty(navigator, 'clipboard', 'get').and.returnValue(fakeClipboard as unknown as Clipboard);
    spyOn(app, 'btoaUnicode').and.callThrough();
    app.copyShareUrl();
    expect(app.btoaUnicode).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('should not remove category if index is invalid', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }]);
    app.removeCategory(5); // invalid index
    expect(app.categories.length).toBe(1);
  });

  it('should handle empty string in btoaUnicode/atobUnicode', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const encoded = app.btoaUnicode('');
    const decoded = app.atobUnicode(encoded);
    expect(decoded).toBe('');
  });

  it('should handle malformed base64 in atobUnicode', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(() => app.atobUnicode('!!!notbase64!!!')).toThrow();
  });

  it('should handle clipboard unavailable in copyShareUrl', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // Simulate missing clipboard property by deleting it and restoring after
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      get: () => undefined,
      configurable: true
    });
    expect(() => app.copyShareUrl()).not.toThrow();
    Object.defineProperty(navigator, 'clipboard', {
      get: () => originalClipboard,
      configurable: true
    });
  });

  it('should handle copyShareUrl when clipboard.writeText throws', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // Provide a fake clipboard with writeText that throws
    const fakeClipboard = {
      writeText: () => { throw new Error('fail'); }
    };
    spyOnProperty(navigator, 'clipboard', 'get').and.returnValue(fakeClipboard as unknown as Clipboard);
    // Should not throw, but should log error
    spyOn(console, 'error');
    expect(() => app.copyShareUrl()).not.toThrow();
    expect(console.error).toHaveBeenCalledWith('Clipboard error:', jasmine.any(Error));
  });

  it('should change category and update selectedCategoryIndex', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }]);
    app.onCategoryChange(0);
    expect(app.selectedCategoryIndex).toBe(0);
  });

  it('should change category name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }]);
    app.onCategoryNameChange('B', 0);
    expect(app.categories[0].name).toBe('B');
  });

  it('should change number of fields', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.catState.setCategories([{ id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }]);
    app.onNumberOfFieldsChange(3, 0);
    expect(app.categories[0].numberOfFields).toBe(3);
  });

  it('should handle tab change', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.selectedCategoryIndex = 0;
    app.onTabChange({ index: 1 });
    expect(app.selectedCategoryIndex).toBe(1);
  });

  it('should import from url and decode categories', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const categories = [{ id: 1, name: 'A', teams: [], displayMatrix: [], numberOfFields: 1 }];
    const encoded = app.btoaUnicode(JSON.stringify(categories));
    spyOn(window, 'prompt').and.returnValue(encoded);
    app.importFromUrl();
    expect(app.categories.length).toBe(1);
  });

  it('should handle importFromUrl with invalid data', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(window, 'prompt').and.returnValue('!@#$');
    expect(() => app.importFromUrl()).not.toThrow();
  });
});

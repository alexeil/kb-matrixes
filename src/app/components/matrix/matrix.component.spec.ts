import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatrixComponent } from './matrix.component';

describe('MatrixComponent', () => {
  let component: MatrixComponent;
  let fixture: ComponentFixture<MatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatrixComponent],
      imports: [MatFormFieldModule, MatInputModule, FormsModule, BrowserAnimationsModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update matrix on teams input', () => {
    component.teams = ['A', 'B', 'C'];
    component.catIndex = 0;
    component.ngOnChanges({ teams: { currentValue: ['A', 'B', 'C'], previousValue: [], firstChange: true, isFirstChange: () => true } });
    expect(Array.isArray(component.displayMatrix)).toBeTrue();
  });

  it('should update matrix and category on numberOfFields change', () => {
    component.teams = ['A', 'B', 'C'];
    component.catIndex = 0;
    component.numberOfFields = 2;
    spyOn(component, 'updateMatrix').and.callThrough();
    spyOn(component['catState'], 'updateCategory');
    component.onNumberOfFieldsChange();
    expect(component.updateMatrix).toHaveBeenCalled();
    expect(component['catState'].updateCategory).toHaveBeenCalled();
  });

  it('should set displayMatrix to empty if no matrixSet', () => {
    component.teams = [];
    component.numberOfFields = 1;
    component.updateMatrix();
    expect(component.displayMatrix).toEqual([]);
  });
});

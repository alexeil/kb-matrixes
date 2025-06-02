import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TeamInputComponent } from './team-input.component';

describe('TeamInputComponent', () => {
  let component: TeamInputComponent;
  let fixture: ComponentFixture<TeamInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamInputComponent],
      imports: [MatFormFieldModule, MatInputModule, FormsModule, BrowserAnimationsModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a team if teamName is not empty', () => {
    component.teams = ['A'];
    component.catIndex = 0;
    component.teamName = 'B';
    spyOn(component['catState'], 'updateCategory');
    // Patch categories for updateCategory
    component['catState'].setCategories([{ id: 1, name: 'Cat', teams: ['A'], displayMatrix: [], numberOfFields: 1 }]);
    component.addTeam();
    expect(component['catState'].updateCategory).toHaveBeenCalled();
    expect(component.teamName).toBe('');
  });

  it('should not add a team if teamName is empty', () => {
    component.teams = ['A'];
    component.catIndex = 0;
    component.teamName = '   ';
    spyOn(component['catState'], 'updateCategory');
    component.addTeam();
    expect(component['catState'].updateCategory).not.toHaveBeenCalled();
  });

  it('should remove a team', () => {
    component.teams = ['A', 'B'];
    component.catIndex = 0;
    spyOn(component['catState'], 'updateCategory');
    component['catState'].setCategories([{ id: 1, name: 'Cat', teams: ['A', 'B'], displayMatrix: [], numberOfFields: 1 }]);
    component.removeTeam(1);
    expect(component['catState'].updateCategory).toHaveBeenCalled();
  });

  it('should shuffle teams', () => {
    component.teams = ['A', 'B', 'C'];
    component.catIndex = 0;
    spyOn(component['catState'], 'updateCategory');
    component['catState'].setCategories([{ id: 1, name: 'Cat', teams: ['A', 'B', 'C'], displayMatrix: [], numberOfFields: 1 }]);
    component.shuffleTeams();
    expect(component['catState'].updateCategory).toHaveBeenCalled();
  });
});

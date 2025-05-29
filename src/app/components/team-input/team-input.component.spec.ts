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
});

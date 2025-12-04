import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalSettingComponent } from './goal-setting.component';

describe('GoalSettingComponent', () => {
  let component: GoalSettingComponent;
  let fixture: ComponentFixture<GoalSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

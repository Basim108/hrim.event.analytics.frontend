import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOfMonthComponent } from './day-of-month.component';

describe('DayOfMonthComponent', () => {
  let component: DayOfMonthComponent;
  let fixture: ComponentFixture<DayOfMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOfMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayOfMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

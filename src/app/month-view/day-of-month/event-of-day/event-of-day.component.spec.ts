import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOfDayComponent } from './event-of-day.component';

describe('EventOfDayComponent', () => {
  let component: EventOfDayComponent;
  let fixture: ComponentFixture<EventOfDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOfDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

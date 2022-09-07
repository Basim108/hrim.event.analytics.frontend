import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeItemComponent } from './event-type-item.component';

describe('EventTypeItemComponent', () => {
  let component: EventTypeItemComponent;
  let fixture: ComponentFixture<EventTypeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTypeItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

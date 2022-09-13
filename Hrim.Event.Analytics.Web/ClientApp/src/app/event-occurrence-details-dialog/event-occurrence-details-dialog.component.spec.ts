import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOccurrenceDetailsDialog } from './event-occurrence-details-dialog.component';

describe('EventOccurrenceDetailsDialogComponent', () => {
  let component: EventOccurrenceDetailsDialog;
  let fixture: ComponentFixture<EventOccurrenceDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOccurrenceDetailsDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOccurrenceDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

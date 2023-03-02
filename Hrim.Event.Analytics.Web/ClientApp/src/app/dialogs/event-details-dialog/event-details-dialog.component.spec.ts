import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDialog } from './event-details-dialog.component';

describe('EventDetailsDialogComponent', () => {
  let component: EventDetailsDialog;
  let fixture: ComponentFixture<EventDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetailsDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

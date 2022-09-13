import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDurationDetailsDialog } from './event-duration-details-dialog.component';

describe('EventDurationDetailsDialogComponent', () => {
  let component: EventDurationDetailsDialog;
  let fixture: ComponentFixture<EventDurationDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDurationDetailsDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDurationDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

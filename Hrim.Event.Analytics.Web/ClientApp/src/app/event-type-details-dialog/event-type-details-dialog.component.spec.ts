import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeDetailsDialog } from './event-type-details-dialog.component';

describe('EventTypeDetailsDialogComponent', () => {
  let component: EventTypeDetailsDialog;
  let fixture: ComponentFixture<EventTypeDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTypeDetailsDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

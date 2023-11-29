import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventOfDayComponent} from './event-of-day.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LogService} from "../../../services/log.service";
import {EventTypeService} from "../../../services/user-event-type.service";
import {EventTypeTestData} from "../../../../test_data/event-types";
import {OccurrenceTestData} from "../../../../test_data/events";
import {By} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HrimEventService} from "../../../services/hrim-event.service";
import {Observable, of} from "rxjs";
import {SomeEventModel} from "../../../shared/some-event.model";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NotificationService} from "../../../services/notification.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('EventOfDayComponent', () => {
  let component: EventOfDayComponent;
  let fixture: ComponentFixture<EventOfDayComponent>;
  let eventTypeService: EventTypeService
  let eventService: HrimEventService
  let testOccurrences: OccurrenceTestData
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes = new EventTypeTestData()
    testOccurrences = new OccurrenceTestData(testEventTypes)
    await TestBed.configureTestingModule({
                                           declarations: [EventOfDayComponent],
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatInputModule,
                                             MatButtonModule,
                                             MatDialogModule,
                                             MatSelectModule,
                                             MatDatepickerModule,
                                             NgxMatDatetimePickerModule,
                                             NgxMatTimepickerModule,
                                             NgxMatNativeDateModule,
                                             NoopAnimationsModule,
                                             MatSnackBarModule
                                           ],
                                           providers   : [LogService, EventTypeService, HrimEventService, NotificationService]
                                         })
                 .compileComponents();
    eventTypeService = TestBed.inject(EventTypeService)
    eventService     = TestBed.inject(HrimEventService)

    fixture              = TestBed.createComponent(EventOfDayComponent);
    component            = fixture.componentInstance;
    component.eventOfDay = testOccurrences.reading_1
    component.isVisible  = true

    eventService.registerEventContext(component.eventOfDay)
    eventTypeService.updateTypeContext(testEventTypes.reading, true)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('given selected event type should display its event', () => {
    eventTypeService.updateTypeContext(testEventTypes.reading, true)
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.event-of-day'))).not.toBeNull()
  });

  it('given no selected event type should hide its event', () => {
    eventTypeService.updateTypeContext(testEventTypes.reading, false)
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.event-of-day'))).toBeNull()
  });

  it('given prevEvent with the same color should dash its own top border', () => {
    eventTypeService.updateTypeContext(testEventTypes.reading, true)
    component.prevEventOfDay = testOccurrences.reading_1
    fixture.detectChanges();

    const style = fixture.debugElement.parent?.nativeElement.querySelector('.event-of-day').getAttribute('style')
    expect(style).toContain('border-top: 1px dashed black')
  });

  it('given prevEvent with the different color should dash its own top border', () => {
    eventTypeService.updateTypeContext(testEventTypes.reading, true)
    component.prevEventOfDay = testOccurrences.yoga_practice_1
    fixture.detectChanges();

    const style = fixture.debugElement.parent?.nativeElement.querySelector('.event-of-day').getAttribute('style')
    expect(style).toContain('border-top: none')
  });

  it('click on delete btn should call initiate deletion on backend', () => {
    spyOn(eventService, 'deleteEvent')
    spyOn(window, 'confirm').and.returnValue(true)
    const deleteBtn = fixture.debugElement.nativeElement.querySelector('.delete-btn')
    expect(deleteBtn).toBeTruthy()
    deleteBtn.click()

    expect(eventService.deleteEvent).toHaveBeenCalledWith(component.eventOfDay)
  });

  it('event deletion should emit delete event on successful pipe', (done) => {
    spyOn(component.delete, 'emit')
    spyOn(window, 'confirm').and.returnValue(true)
    const deletionPipe = of(component.eventOfDay)
    spyOn(eventService, 'deleteEvent').and.returnValue(deletionPipe)

    const event$ = { stopPropagation(){}}
    spyOn(event$, 'stopPropagation')
    component.onDelete(event$)

    expect(component.delete.emit).toHaveBeenCalledWith(component.eventOfDay)
    done()
  });

  it('event deletion when on failure should not emit delete event and set unsaved state', (done) => {
    spyOn(component.delete, 'emit')
    spyOn(window, 'confirm').and.returnValue(true)
    const deletionPipe = new Observable<SomeEventModel>((observer) => {
      observer.error('failed to delete an event')
    })
    spyOn(eventService, 'deleteEvent').and.returnValue(deletionPipe)
    const event$ = { stopPropagation(){}}
    spyOn(event$, 'stopPropagation')
    component.onDelete(event$)

    expect(component.delete.emit).not.toHaveBeenCalled()
    const eventContext = eventService.eventContext[component.eventOfDay.id]
    expect(eventContext).toBeTruthy()
    expect(eventContext.isDeleted).toBeTrue()
    expect(eventContext.isUnsaved).toBeTrue()
    expect(eventContext.isModified).toBeFalse()
    expect(eventContext.entity).toBeTruthy()
    expect(eventContext.entity).toEqual(component.eventOfDay)

    expect(event$.stopPropagation).toHaveBeenCalled()
    done()
  });

  it('event deletion should ask confirmation before deleting an event', () => {
    spyOn(component.delete, 'emit')
    spyOn(window, 'confirm')

    const event$ = { stopPropagation(){}}
    component.onDelete(event$)

    expect(window.confirm).toHaveBeenCalled()
  });

  it('event deletion should not delete when no confirmation received', () => {
    spyOn(eventService, 'deleteEvent')
    spyOn(window, 'confirm').and.returnValue(false)

    const event$ = { stopPropagation(){}}
    component.onDelete(event$)

    expect(eventService.deleteEvent).not.toHaveBeenCalled()
  });
});

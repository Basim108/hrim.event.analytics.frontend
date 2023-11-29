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
                                           providers   : [
                                             LogService, EventTypeService, HrimEventService,
                                             NotificationService
                                           ]
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
});

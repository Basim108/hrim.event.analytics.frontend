import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayOfMonthComponent}                                                        from './day-of-month.component';
import {EventOfDayComponent}                                                        from "./event-of-day/event-of-day.component";
import {HttpClientTestingModule}                                                    from "@angular/common/http/testing";
import {LogService}                                                                 from "../../services/log.service";
import {HrimEventService}                                                           from "../../services/hrim-event.service";
import {DayModel}                                                                   from "../../shared/day.model";
import {DateTime}                                                                   from "luxon";
import {DurationTestData, OccurrenceTestData}                                       from "../../../test_data/events";
import {EventTypeService}                                                           from "../../services/user-event-type.service";
import {EventTypeTestData}                                                          from "../../../test_data/event-types";
import {MatMenuModule}                                                              from "@angular/material/menu";
import {MatIconModule}                                                              from "@angular/material/icon";
import {MatInputModule}                                                             from "@angular/material/input";
import {MatButtonModule}                                                            from "@angular/material/button";
import {MatDialogModule}                                                            from "@angular/material/dialog";
import {MatSelectModule}                                                            from "@angular/material/select";
import {MatDatepickerModule}                                                        from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule}                                                       from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NotificationService} from "../../services/notification.service";

describe('DayOfMonthComponent', () => {
  let component: DayOfMonthComponent;
  let fixture: ComponentFixture<DayOfMonthComponent>;
  let eventTypeService: EventTypeService
  let testOccurrences: OccurrenceTestData
  let testDurations: DurationTestData
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes = new EventTypeTestData()
    testOccurrences = new OccurrenceTestData(testEventTypes)
    testDurations = new DurationTestData(testEventTypes)

    await TestBed.configureTestingModule({
                                           declarations: [DayOfMonthComponent, EventOfDayComponent],
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatInputModule,
                                             MatButtonModule,
                                             MatMenuModule,
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
                                             LogService,
                                             HrimEventService,
                                             EventTypeService,
                                             NotificationService
                                           ]
                                         })
                 .compileComponents();

    eventTypeService = TestBed.inject(EventTypeService)
    fixture   = TestBed.createComponent(DayOfMonthComponent);
    component = fixture.componentInstance;

    component.dayModel         = new DayModel(DateTime.now())
    component.currentMonth     = DateTime.now()
    component.occurrenceEvents = []
    component.durationEvents   = []
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getTotalVisibleTypeCount should exclude occurrence events which event types are not selected', () => {
    component.occurrenceEvents = [testOccurrences.reading_1, testOccurrences.yoga_practice_1]
    eventTypeService.updateTypeContext(testEventTypes.reading, true, false)
    fixture.detectChanges();

    const actualCount = component.getTotalVisibleTypeCount(component.occurrenceEvents, component.durationEvents)
    expect(actualCount).toEqual(1)
  });

  it('getTotalVisibleTypeCount should exclude duration events which event types are not selected', () => {
    component.durationEvents = [testDurations.reading_1, testDurations.yoga_practice_1]
    eventTypeService.updateTypeContext(testEventTypes.reading, true, false)
    fixture.detectChanges();

    const actualCount = component.getTotalVisibleTypeCount(component.occurrenceEvents, component.durationEvents)
    expect(actualCount).toEqual(1)
  });

  it('getTotalVisibleTypeCount should exclude durations & occurrence events which event types are not selected', () => {
    component.durationEvents = [testDurations.reading_1, testDurations.yoga_practice_1]
    component.occurrenceEvents = [testOccurrences.reading_1, testOccurrences.yoga_practice_1]
    eventTypeService.updateTypeContext(testEventTypes.reading, true, false)
    fixture.detectChanges();

    const actualCount = component.getTotalVisibleTypeCount(component.occurrenceEvents, component.durationEvents)
    expect(actualCount).toEqual(2)
  });
});

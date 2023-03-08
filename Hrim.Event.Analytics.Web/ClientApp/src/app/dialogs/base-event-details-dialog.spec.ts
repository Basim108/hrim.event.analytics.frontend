import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BaseEventDetailsDialog}                                                     from "./base-event-details-dialog";
import {OccurrenceEventDetailsDialog}                                               from "./occurrence-event-details-dialog/occurrence-event-details-dialog";
import {DateTime}                                                                   from "luxon";
import {HttpClientTestingModule}                                                    from "@angular/common/http/testing";
import {MatIconModule}                                                              from "@angular/material/icon";
import {MatButtonModule}                                                            from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef}                             from "@angular/material/dialog";
import {EventTypeService}                                                           from "../services/user-event-type.service";
import {MatSelectModule}                                                            from "@angular/material/select";
import {MatDatepickerModule}                                                        from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {OccurrenceEventDetailsDialogRequest}                                        from "../shared/dialogs/occurrence-event-details-dialog-request";
import {HrimEventService}                                                           from "../services/hrim-event.service";
import {LogService}                                                                 from "../services/log.service";
import {OCCURRENCE_EVENTS}                                                          from "../../test_data/events";
import {FormBuilder}                                                                from "@angular/forms";
import {MatInputModule}                                                             from "@angular/material/input";
import {NoopAnimationsModule}                                                       from "@angular/platform-browser/animations";


describe('BaseEventDetailsDialog', () => {
  let component: OccurrenceEventDetailsDialog;
  let fixture: ComponentFixture<OccurrenceEventDetailsDialog>;

  const dialogRequest = new OccurrenceEventDetailsDialogRequest(OCCURRENCE_EVENTS['reading_1'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
                                             NoopAnimationsModule
                                           ],
                                           declarations: [OccurrenceEventDetailsDialog],
                                           providers   : [
                                             EventTypeService, HrimEventService, LogService,
                                             FormBuilder,
                                             {
                                               provide : MAT_DIALOG_DATA,
                                               useValue: dialogRequest
                                             },
                                             {
                                               provide: MatDialogRef,
                                               useValue: {}
                                             },
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(OccurrenceEventDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('isDateChanged given null && Date should return true', () => {
    const actual = component.isDateChanged(null, new Date())
    expect(actual).toBeTrue()
  });
  it('isDateChanged given DateTime && null should return true', () => {
    const actual = component.isDateChanged(DateTime.now(), null)
    expect(actual).toBeTrue()
  });
  it('isDateChanged given both null should return false', () => {
    const actual = component.isDateChanged(null, null)
    expect(actual).toBeFalse()
  });
  it('isDateChanged given same date objects should return false', () => {
    const datetime = DateTime.fromFormat('2023-02-01 10:30', 'yyyy-MM-dd hh:mm')
    const date     = new Date(Date.parse('2023-02-01 10:30'))
    const actual   = component.isDateChanged(datetime, date)
    expect(actual).toBeFalse()
  });
  it('isDateChanged given different dates should return true', () => {
    const datetime = DateTime.fromFormat('2023-02-02 10:30', 'yyyy-MM-dd hh:mm')
    const date     = new Date(Date.parse('2023-02-01 10:30'))
    const actual   = component.isDateChanged(datetime, date)
    expect(actual).toBeTrue()
  });
  it('isDateChanged given different times should return true', () => {
    const datetime = DateTime.fromFormat('2023-02-01 10:30', 'yyyy-MM-dd hh:mm')
    const date     = new Date(Date.parse('2023-02-01 10:31'))
    const actual   = component.isDateChanged(datetime, date)
    expect(actual).toBeTrue()
  });
});


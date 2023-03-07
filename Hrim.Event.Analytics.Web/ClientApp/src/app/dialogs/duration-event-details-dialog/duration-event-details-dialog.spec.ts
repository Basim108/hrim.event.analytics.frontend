import {ComponentFixture, TestBed}                                                  from '@angular/core/testing';
import {DurationEventDetailsDialog}                                                 from "./duration-event-details-dialog";
import {OccurrenceEventDetailsDialogRequest} from "../../shared/dialogs/occurrence-event-details-dialog-request";
import {DURATION_EVENTS, OCCURRENCE_EVENTS}  from "../../../test_data/events";
import {HttpClientTestingModule}             from "@angular/common/http/testing";
import {MatIconModule}                                                              from "@angular/material/icon";
import {MatInputModule}                                                             from "@angular/material/input";
import {MatButtonModule}                                                            from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef}                             from "@angular/material/dialog";
import {MatSelectModule}                                                            from "@angular/material/select";
import {MatDatepickerModule}                                                        from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule}                                                       from "@angular/platform-browser/animations";
import {OccurrenceEventDetailsDialog}                                               from "../occurrence-event-details-dialog/occurrence-event-details-dialog";
import {EventTypeService}                                                           from "../../services/user-event-type.service";
import {HrimEventService}                                                           from "../../services/hrim-event.service";
import {LogService}                                                                 from "../../services/log.service";
import {FormBuilder}                                                                from "@angular/forms";
import {DurationEventDetailsDialogRequest}                                          from "../../shared/dialogs/duration-event-details-dialog-request";

describe('DurationEventDetailsDialog', () => {
  let component: DurationEventDetailsDialog;
  let fixture: ComponentFixture<DurationEventDetailsDialog>;

  const dialogRequest = new DurationEventDetailsDialogRequest(DURATION_EVENTS['reading_1'])

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
                                           declarations: [DurationEventDetailsDialog],
                                           providers   : [
                                             EventTypeService, HrimEventService, LogService,
                                             FormBuilder,
                                             {
                                               provide : MAT_DIALOG_DATA,
                                               useValue: dialogRequest
                                             },
                                             {
                                               provide : MatDialogRef,
                                               useValue: {}
                                             },
                                           ]
                                         })
                 .compileComponents();

    fixture = TestBed.createComponent(DurationEventDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

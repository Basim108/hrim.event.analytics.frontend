import {ComponentFixture, TestBed}                                                  from '@angular/core/testing';
import {OccurrenceEventDetailsDialog}                                               from "./occurrence-event-details-dialog";
import {OccurrenceEventDetailsDialogRequest}                                        from "../../shared/dialogs/occurrence-event-details-dialog-request";
import {OCCURRENCE_EVENTS}                                                          from "../../../test_data/events";
import {HttpClientTestingModule}                                                    from "@angular/common/http/testing";
import {MatIconModule}                                                              from "@angular/material/icon";
import {MatInputModule}                                                             from "@angular/material/input";
import {MatButtonModule}                                                            from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef}                             from "@angular/material/dialog";
import {MatSelectModule}                                                            from "@angular/material/select";
import {MatDatepickerModule}                                                        from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule}                                                       from "@angular/platform-browser/animations";
import {EventTypeService}                                                           from "../../services/user-event-type.service";
import {HrimEventService}                                                           from "../../services/hrim-event.service";
import {LogService}                                                                 from "../../services/log.service";
import {FormBuilder}                                                                from "@angular/forms";


describe('OccurrenceEventDetailsDialog', () => {
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
                                               provide : MatDialogRef,
                                               useValue: {}
                                             },
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(OccurrenceEventDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed}                                                  from '@angular/core/testing';
import {DurationEventDetailsDialog}                                                 from "./duration-event-details-dialog";
import {DURATION_EVENTS, OCCURRENCE_EVENTS}                                         from "../../../test_data/events";
import {HttpClientTestingModule}                                                    from "@angular/common/http/testing";
import {MatIconModule}                                                              from "@angular/material/icon";
import {MatInputModule}                                                             from "@angular/material/input";
import {MatButtonModule}                                                            from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef}                  from "@angular/material/dialog";
import {MatSelectModule}                                                            from "@angular/material/select";
import {MatDatepickerModule}                                                        from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule}                                                       from "@angular/platform-browser/animations";
import {EventTypeService}                                                           from "../../services/user-event-type.service";
import {HrimEventService}                                                           from "../../services/hrim-event.service";
import {LogService}                                                                 from "../../services/log.service";
import {FormBuilder}                                                                from "@angular/forms";
import {DurationEventDetailsDialogRequest}                                          from "../../shared/dialogs/duration-event-details-dialog-request";
import {OccurrenceEventDetailsDialog}                                               from "../occurrence-event-details-dialog/occurrence-event-details-dialog";
import {EVENT_TYPES}                                                                from "../../../test_data/event-types";
import {of}                                                                         from "rxjs";
import {DurationEventModel}                                                         from "../../shared/duration-event.model";

describe('DurationEventDetailsDialog', () => {
  let component: DurationEventDetailsDialog;
  let fixture: ComponentFixture<DurationEventDetailsDialog>;

  let eventService: HrimEventService

  const dialogRequest = new DurationEventDetailsDialogRequest(DURATION_EVENTS['reading_1'])

  beforeEach(async () => {
    const dialogRef = {
      afterClosed: of<boolean>(false),
      close() {
      }
    }
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
                                             {provide: MAT_DIALOG_DATA, useValue: dialogRequest},
                                             {provide: MatDialogRef, useValue: dialogRef},
                                           ]
                                         })
                 .compileComponents();

    const eventTypeService = TestBed.inject(EventTypeService)
    eventService           = TestBed.inject(HrimEventService)
    fixture                = TestBed.createComponent(DurationEventDetailsDialog);
    component              = fixture.componentInstance;

    eventTypeService.updateTypeContext(EVENT_TYPES['reading'], true, false)
    eventTypeService.updateTypeContext(EVENT_TYPES['yogaPractice'], true, false)
    eventService.registerEventContext(dialogRequest.model)
    fixture.detectChanges();
  });

  it('updateModelFromControls should update model', () => {
    const expectedFrom = '2023-03-08T12:04:43.317+04:00'
    const expectedTo = '2023-03-09T12:04:43.317+04:00'
    component.form.controls['from'].setValue(new Date(expectedFrom))
    component.form.controls['to'].setValue(new Date(expectedTo))
    component.form.controls['eventType'].setValue(EVENT_TYPES['yogaPractice'].id)
    component.selectedEventTypeId = EVENT_TYPES['yogaPractice'].id

    component.updateModelFromControls()

    expect(dialogRequest.model.startedAt.toISO()).toEqual(expectedFrom)
    expect(dialogRequest.model.finishedAt).toBeTruthy()
    expect(dialogRequest.model.finishedAt!.toISO()).toEqual(expectedTo)
    expect(dialogRequest.model.eventType).toBeTruthy()
    expect(dialogRequest.model.eventType.id).toEqual(EVENT_TYPES['yogaPractice'].id)
  });

  it('changing from field should set isChanged', () => {
    const fromCtrl = component.form.controls['from']
    expect(fromCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    fromCtrl.setValue(new Date())
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('changing to field should set isChanged', () => {
    const toCtrl = component.form.controls['to']
    expect(toCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    toCtrl.setValue(new Date())
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('changing eventType field should set isChanged', () => {
    expect(component.isChanged).toBeFalse()
    component.form.controls['eventType'].setValue(EVENT_TYPES['yogaPractice'].id)
    component.selectedEventTypeId = EVENT_TYPES['yogaPractice'].id

    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('given not changed form and isChanged set to true should not save entity', (done) => {
    component.isChanged = true
    spyOn(eventService, 'save').and.returnValue(of(OCCURRENCE_EVENTS['reading_1']))
    component.onSave()

    expect(eventService.save).not.toHaveBeenCalled()
    done()
  });

  it('given changed form should make save entity request', () => {
    component.form.controls['eventType'].setValue(EVENT_TYPES['yogaPractice'].id)
    component.selectedEventTypeId = EVENT_TYPES['yogaPractice'].id

    const dialogRefSpyObj = jasmine.createSpyObj({
                                                   afterClosed: of<DurationEventModel>(dialogRequest.model),
                                                   close      : null
                                                 })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventService, 'save').and.callThrough()

    component.onSave()

    expect(eventService.save).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                              eventType: jasmine.objectContaining({
                                                                                                                    id: EVENT_TYPES['yogaPractice'].id
                                                                                                                  })
                                                                            }))
  })
});

import {ComponentFixture, TestBed}                                                  from '@angular/core/testing';
import {DurationEventDetailsDialog}                                                 from "./duration-event-details-dialog";
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
import {EventTypeTestData}                                                          from "../../../test_data/event-types";
import {of}                                                                         from "rxjs";
import {DurationEventModel}                                                         from "../../shared/duration-event.model";
import {DurationTestData}                                                           from "../../../test_data/events";

describe('DurationEventDetailsDialog', () => {
  let component: DurationEventDetailsDialog;
  let fixture: ComponentFixture<DurationEventDetailsDialog>;
  let eventService: HrimEventService
  let eventTypeService: EventTypeService
  let dialogRequest: DurationEventDetailsDialogRequest
  let testDurations: DurationTestData
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes  = new EventTypeTestData()
    testDurations   = new DurationTestData(testEventTypes)
    const dialogRef = {
      afterClosed: of<boolean>(false),
      close      : null
    }
    dialogRequest   = new DurationEventDetailsDialogRequest(testDurations.reading_1)
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
                                             {provide: MAT_DIALOG_DATA, useValue: dialogRequest},
                                             {provide: MatDialogRef, useValue: dialogRef},
                                           ]
                                         })
                 .compileComponents();

    eventTypeService = TestBed.inject(EventTypeService)
    eventService     = TestBed.inject(HrimEventService)
    fixture          = TestBed.createComponent(DurationEventDetailsDialog);
    component        = fixture.componentInstance;

    eventTypeService.updateTypeContext(testEventTypes.reading, false, false)
    eventTypeService.updateTypeContext(testEventTypes.yogaPractice, false, false)
    eventService.registerEventContext(dialogRequest.model)
    fixture.detectChanges();
  });

  afterEach(() => {
    eventTypeService.typeContexts = {}
    eventService.eventContext     = {}
  })

  it('updateModelFromControls should update model', () => {
    const expectedFrom = '2023-03-08T12:04:43.317'
    const expectedTo   = '2023-03-09T12:04:43.317'
    component.form.controls['from'].setValue(new Date(expectedFrom))
    component.form.controls['to'].setValue(new Date(expectedTo))
    component.form.controls['eventType'].setValue(testEventTypes.yogaPractice.id)
    component.selectedEventTypeId = testEventTypes.yogaPractice.id

    component.updateModelFromControls()

    // note: when running test in ci environment. actual timezone sets to UTC, so ignore it
    expect(dialogRequest.model.startedAt.toISO()!.slice(0, -6)).toEqual(expectedFrom)
    expect(dialogRequest.model.finishedAt).toBeTruthy()
    expect(dialogRequest.model.finishedAt!.toISO()!.slice(0, -6)).toEqual(expectedTo)
    expect(dialogRequest.model.eventType).toBeTruthy()
    expect(dialogRequest.model.eventType.id).toEqual(testEventTypes.yogaPractice.id)
  });

  it('changing note field should set isChanged', () => {
    const fromCtrl = component.form.controls['note']
    expect(fromCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    fromCtrl.setValue('new value')
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
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
    component.form.controls['eventType'].setValue(testEventTypes.yogaPractice.id)
    component.selectedEventTypeId = testEventTypes.yogaPractice.id

    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('given not changed form and isChanged set to true should not save entity', (done) => {
    component.isChanged = true
    spyOn(eventService, 'save').and.returnValue(of(testDurations.reading_1))
    component.onSave()

    expect(eventService.save).not.toHaveBeenCalled()
    done()
  });

  it('given changed form should make save entity request', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
                                                   afterClosed: of<DurationEventModel>(dialogRequest.model),
                                                   close      : null
                                                 })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventService, 'save').and.callThrough()
    component.form.controls['eventType'].setValue(testEventTypes.yogaPractice.id)
    component.selectedEventTypeId = testEventTypes.yogaPractice.id

    component.onSave()

    const expectedEventType = jasmine.objectContaining({id: testEventTypes.yogaPractice.id})
    const expectedArg       = jasmine.objectContaining({eventType: expectedEventType})
    expect(eventService.save).toHaveBeenCalledWith(expectedArg)
  })
});

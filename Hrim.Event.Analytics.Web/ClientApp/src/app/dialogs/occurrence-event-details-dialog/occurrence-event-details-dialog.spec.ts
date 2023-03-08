import {ComponentFixture, TestBed}                                                  from '@angular/core/testing';
import {OccurrenceEventDetailsDialog}                                               from "./occurrence-event-details-dialog";
import {OccurrenceEventDetailsDialogRequest}                                        from "../../shared/dialogs/occurrence-event-details-dialog-request";
import {OccurrenceTestData}                                                         from "../../../test_data/events";
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
import {EventTypeTestData}                                                          from "../../../test_data/event-types";
import {of}                                                                         from "rxjs";
import {OccurrenceEventModel}                                                       from "../../shared/occurrence-event.model";


describe('OccurrenceEventDetailsDialog', () => {
  let component: OccurrenceEventDetailsDialog;
  let fixture: ComponentFixture<OccurrenceEventDetailsDialog>;
  let eventService: HrimEventService
  let eventTypeService: EventTypeService
  let dialogRequest: OccurrenceEventDetailsDialogRequest
  let testOccurrences: OccurrenceTestData
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes  = new EventTypeTestData()
    testOccurrences = new OccurrenceTestData(testEventTypes)
    dialogRequest   = new OccurrenceEventDetailsDialogRequest(testOccurrences.reading_1)
    const dialogRef = {
      afterClosed: of<boolean>(false),
      close      : null
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

    eventTypeService = TestBed.inject(EventTypeService)
    eventService     = TestBed.inject(HrimEventService)
    fixture          = TestBed.createComponent(OccurrenceEventDetailsDialog);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateModelFromControls should update model', () => {
    const expectedFrom = '2023-03-08T12:04:43.317+04:00'
    component.form.controls['from'].setValue(new Date(expectedFrom))
    component.form.controls['eventType'].setValue(testEventTypes.yogaPractice.id)
    component.selectedEventTypeId = testEventTypes.yogaPractice.id

    component.updateModelFromControls()

    expect(dialogRequest.model.occurredAt.toISO()).toEqual(expectedFrom)
    expect(dialogRequest.model.eventType).toBeTruthy()
    expect(dialogRequest.model.eventType.id).toEqual(testEventTypes.yogaPractice.id)
  });

  it('changing from field should set isChanged', () => {
    const fromCtrl = component.form.controls['from']
    expect(fromCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    fromCtrl.setValue(new Date())
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
    spyOn(eventService, 'save').and.returnValue(of(testOccurrences.reading_1))
    component.onSave()

    expect(eventService.save).not.toHaveBeenCalled()
    done()
  });

  it('given changed form should make save entity request', () => {
    component.form.controls['eventType'].setValue(testEventTypes.yogaPractice.id)
    component.selectedEventTypeId = testEventTypes.yogaPractice.id

    const dialogRefSpyObj = jasmine.createSpyObj({
                                                   afterClosed: of<OccurrenceEventModel>(dialogRequest.model),
                                                   close      : null
                                                 })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventService, 'save').and.callThrough()

    component.onSave()

    const expectedEventType = jasmine.objectContaining({id: testEventTypes.yogaPractice.id})
    const expectedArg       = jasmine.objectContaining({eventType: expectedEventType})
    expect(eventService.save).toHaveBeenCalledWith(expectedArg)
  })
})

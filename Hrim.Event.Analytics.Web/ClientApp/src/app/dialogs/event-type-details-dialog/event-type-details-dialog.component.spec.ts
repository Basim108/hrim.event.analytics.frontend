import {ComponentFixture, TestBed}                                         from '@angular/core/testing';
import {EventTypeDetailsDialog}                                            from './event-type-details-dialog.component';
import {HttpClientTestingModule}                                           from "@angular/common/http/testing";
import {MatIconModule}                                                     from "@angular/material/icon";
import {MatInputModule}                                                    from "@angular/material/input";
import {MatButtonModule}                                                   from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef}                    from "@angular/material/dialog";
import {MatSelectModule}                                                   from "@angular/material/select";
import {MatDatepickerModule}                                               from "@angular/material/datepicker";
import {NgxMatNativeDateModule, NgxMatTimepickerModule}                    from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule}                                              from "@angular/platform-browser/animations";
import {EventTypeDetailsDialogRequest}                                     from "../../shared/dialogs/event-type-details-dialog-request";
import {EventTypeTestData}                                                 from "../../../test_data/event-types";
import {EventTypeService}                                                  from "../../services/user-event-type.service";
import {LogService}                                                        from "../../services/log.service";
import {FormBuilder}                                                       from "@angular/forms";
import {MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS, NgxMatColorPickerModule} from "@angular-material-components/color-picker";
import {UserEventType}                                                     from "../../shared/event-type.model";
import {HrimEventService} from "../../services/hrim-event.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

describe('EventTypeDetailsDialogComponent', () => {
  let component: EventTypeDetailsDialog;
  let fixture: ComponentFixture<EventTypeDetailsDialog>;
  let eventTypeService: EventTypeService
  let eventService: HrimEventService
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes      = new EventTypeTestData()
    const dialogRequest = new EventTypeDetailsDialogRequest(testEventTypes.reading)
    await TestBed.configureTestingModule({
                                           declarations: [EventTypeDetailsDialog],
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatInputModule,
                                             MatButtonModule,
                                             MatDialogModule,
                                             MatSelectModule,
                                             MatAutocompleteModule,
                                             MatDatepickerModule,
                                             NgxMatColorPickerModule,
                                             NgxMatTimepickerModule,
                                             NgxMatNativeDateModule,
                                             NoopAnimationsModule
                                           ],
                                           providers   : [
                                             EventTypeService, LogService,
                                             HrimEventService,
                                             FormBuilder,
                                             {provide: MAT_DIALOG_DATA, useValue: dialogRequest},
                                             {provide: MatDialogRef, useValue: {}},
                                             {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
                                           ]
                                         })
                 .compileComponents();

    eventTypeService = TestBed.inject(EventTypeService)
    eventService     = TestBed.inject(HrimEventService)
    fixture          = TestBed.createComponent(EventTypeDetailsDialog);
    component        = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    eventTypeService.typeContexts = {}
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateModelFromControls should update model', () => {
    component.form.controls['name'].setValue('changed name')
    component.form.controls['description'].setValue('changed description')
    component.form.controls['color'].setValue(component.getColorFromHex('#112233'))
    const model = new UserEventType()

    component.updateModelFromControls(model)

    expect(model.name).toEqual('changed name')
    expect(model.description).toEqual('changed description')
    expect(model.color).toEqual('#112233')
  });

  it('changing name field should set isChanged', () => {
    const nameCtrl = component.form.controls['name']
    expect(nameCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    nameCtrl.setValue('changed name')
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('changing description field should set isChanged', () => {
    const descriptionCtrl = component.form.controls['description']
    expect(descriptionCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    descriptionCtrl.setValue('changed description')
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('changing color field should set isChanged', () => {
    const colorCtrl = component.form.controls['color']
    expect(colorCtrl).toBeTruthy()
    expect(component.isChanged).toBeFalse()
    colorCtrl.setValue(component.getColorFromHex('#112233'))
    component.checkFormChanges()

    expect(component.isChanged).toBeTrue()
  });

  it('given not changed form and isChanged set to true should not save entity', () => {
    component.isChanged = true
    fixture.detectChanges()
    spyOn(eventTypeService, 'save')

    component.onSave()

    expect(eventTypeService.save).not.toHaveBeenCalled()
  });

  it('given changed form should make save entity request', () => {
    const colorCtrl = component.form.controls['color']
    expect(colorCtrl).toBeTruthy()
    colorCtrl.setValue('#112233')
    fixture.detectChanges()
    spyOn(eventTypeService, 'save').and.callThrough()

    component.onSave()

    expect(eventTypeService.save).toHaveBeenCalledWith(jasmine.objectContaining({id: testEventTypes.reading.id}))
  });
});

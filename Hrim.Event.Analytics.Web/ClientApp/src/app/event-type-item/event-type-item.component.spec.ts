import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EventTypeItemComponent} from './event-type-item.component'
import {EventTypeService} from '../services/user-event-type.service'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {EventTypeTestData} from '../../test_data/event-types'
import {of} from 'rxjs'
import {UserEventType} from '../shared/event-type.model'
import {EntityState} from "../shared/entity-state";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NotificationService} from "../services/notification.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


describe('EventTypeItemComponent', () => {
  let component: EventTypeItemComponent
  let fixture: ComponentFixture<EventTypeItemComponent>
  let eventTypeService: EventTypeService
  let testEventTypes: EventTypeTestData
  let eventArg  = new Event('click');

  beforeEach(async () => {
    testEventTypes = new EventTypeTestData()
    const dialogRef = {
      afterClosed: of<boolean>(false),
      close      : null
    }
    await TestBed.configureTestingModule({
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatButtonModule,
                                             MatDialogModule,
                                             MatSnackBarModule,
                                             NoopAnimationsModule
                                           ],
                                           declarations: [EventTypeItemComponent],
                                           providers   : [EventTypeService, NotificationService,
                                                          { provide: MatDialogRef, useValue: dialogRef}]
                                         })
                 .compileComponents()
    eventTypeService    = TestBed.inject(EventTypeService)
    fixture             = TestBed.createComponent(EventTypeItemComponent)
    component           = fixture.componentInstance
    component.eventType = testEventTypes.reading

    const typeContext = new EntityState<UserEventType>()
    typeContext.isSelected = true
    typeContext.entity = testEventTypes.reading
    eventTypeService.typeContexts[testEventTypes.reading.id] = typeContext
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('onEditEventType when dialog canceled should not send save request', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
                                                 afterClosed: of<boolean>(false),
                                                 close      : null
                                               })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService, 'save')
    spyOn(eventArg, 'stopPropagation')

    component.onEditEventType(eventArg)

    expect(eventTypeService.save).not.toHaveBeenCalled()
    expect(eventArg.stopPropagation).toHaveBeenCalled()
  })

  it('after initialization should update selected status from event-type-service', () => {
    expect(component.isSelected).toBeTrue()
  })

  it('toggleEventType should toggle isSelected flag', () => {
    component.isSelected = true
    component.toggleEventType()
    expect(component.isSelected).toBeFalse()
  })

  it('toggleEventType should update event type info', () => {
    component.isSelected = true
    component.toggleEventType()
    expect(eventTypeService.typeContexts[component.eventType.id]).toBeTruthy()
    expect(eventTypeService.typeContexts[component.eventType.id].isSelected).toBeFalse()
  })
})

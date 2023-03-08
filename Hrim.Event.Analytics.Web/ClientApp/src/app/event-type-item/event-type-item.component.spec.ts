import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EventTypeItemComponent}        from './event-type-item.component'
import {EventTypeService}              from '../services/user-event-type.service'
import {HttpClientTestingModule}       from '@angular/common/http/testing'
import {MatIconModule}                 from '@angular/material/icon'
import {MatButtonModule}                          from '@angular/material/button'
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {EventTypeTestData}                        from '../../test_data/event-types'
import {of}                            from 'rxjs'
import {UserEventType}                 from '../shared/event-type.model'
import {EntityState}                   from "../shared/entity-state";

describe('EventTypeItemComponent', () => {
  let component: EventTypeItemComponent
  let fixture: ComponentFixture<EventTypeItemComponent>
  let eventTypeService: EventTypeService
  let testEventTypes: EventTypeTestData

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
                                             MatDialogModule
                                           ],
                                           declarations: [EventTypeItemComponent],
                                           providers   : [EventTypeService,
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

  it('onDeleteEventType should send delete request', () => {
    spyOn(eventTypeService, 'delete').and.returnValue(of({...testEventTypes.reading, is_deleted: true}))

    component.onDeleteEventType()

    expect(eventTypeService.delete).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                                             id: testEventTypes.reading.id
                                                                                           }))
  })

  it('onDeleteEventType should emit delete event', () => {
    spyOn(eventTypeService, 'delete').and.returnValue(of({...testEventTypes.reading, is_deleted: true}))
    spyOn(component.delete, 'emit')

    component.onDeleteEventType()

    expect(component.delete.emit).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                                  id: testEventTypes.reading.id
                                                                                }))
  })

  it('onEditEventType when dialog canceled should not send save request', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
                                                 afterClosed: of<boolean>(false),
                                                 close      : null
                                               })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService, 'save')

    component.onEditEventType()

    expect(eventTypeService.save).not.toHaveBeenCalled()
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

import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EventTypeItemComponent}     from './event-type-item.component'
import {EventTypeService}           from '../services/user-event-type.service'
import {HttpClientTestingModule}    from '@angular/common/http/testing'
import {MatIconModule}              from '@angular/material/icon'
import {MatButtonModule}            from '@angular/material/button'
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import {EVENT_TYPES}                from '../../test_data/event-types'
import {of}                         from 'rxjs'
import {UserEventType}              from '../shared/event-type.model'

describe('EventTypeItemComponent', () => {
  let component: EventTypeItemComponent
  let fixture: ComponentFixture<EventTypeItemComponent>
  let eventTypeService: EventTypeService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatButtonModule,
                                             MatDialogModule
                                           ],
                                           declarations: [EventTypeItemComponent],
                                           providers   : [EventTypeService]
                                         })
                 .compileComponents()
    eventTypeService    = TestBed.inject(EventTypeService)
    fixture             = TestBed.createComponent(EventTypeItemComponent)
    component           = fixture.componentInstance
    component.eventType = EVENT_TYPES['reading']

    eventTypeService.typesInfo[EVENT_TYPES['reading'].id] = {
      isSelected: true,
      eventType : EVENT_TYPES['reading']
    }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('onDeleteEventType should send delete request', () => {
    spyOn(eventTypeService, 'deleteEventType').and.returnValue(of({...EVENT_TYPES['reading'], is_deleted: true}))

    component.onDeleteEventType()

    expect(eventTypeService.deleteEventType).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                                             id: EVENT_TYPES['reading'].id
                                                                                           }))
  })

  it('onDeleteEventType should emit delete event', () => {
    spyOn(eventTypeService, 'deleteEventType').and.returnValue(of({...EVENT_TYPES['reading'], is_deleted: true}))
    spyOn(component.delete, 'emit')

    component.onDeleteEventType()

    expect(component.delete.emit).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                                  id: EVENT_TYPES['reading'].id
                                                                                }))
  })

  it('onEditEventType should send save request', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
                                                 afterClosed: of<UserEventType>({...EVENT_TYPES['reading']}),
                                                 close      : null
                                               })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService, 'saveEventType')

    component.onEditEventType()

    expect(eventTypeService.saveEventType).toHaveBeenCalledWith(jasmine.objectContaining({
                                                                                           id: EVENT_TYPES['reading'].id
                                                                                         }))
  })

  it('onEditEventType when dialog canceled should not send save request', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
                                                 afterClosed: of<boolean>(false),
                                                 close      : null
                                               })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService, 'saveEventType')

    component.onEditEventType()

    expect(eventTypeService.saveEventType).not.toHaveBeenCalled()
  })

  it('after initialization should update selected status from event-type-service', () => {
    expect(component.isSelected).toBeTrue()
  })

  it('on destroy should unsubscribe from deleteEventTypeSub', () => {
    spyOn(eventTypeService, 'deleteEventType').and.returnValue(of({...EVENT_TYPES['reading'], is_deleted: true}))
    component.onDeleteEventType()
    spyOn(component.deleteEventTypeSub, 'unsubscribe')

    fixture.destroy()

    expect(component.deleteEventTypeSub.unsubscribe).toHaveBeenCalled()
  })

  it('toggleEventType should toggle isSelected flag', () => {
    component.isSelected = true
    component.toggleEventType()
    expect(component.isSelected).toBeFalse()
  })

  it('toggleEventType should update event type info', () => {
    component.isSelected = true
    component.toggleEventType()
    expect(eventTypeService.typesInfo[component.eventType.id]).toBeTruthy()
    expect(eventTypeService.typesInfo[component.eventType.id].isSelected).toBeFalse()
  })
})

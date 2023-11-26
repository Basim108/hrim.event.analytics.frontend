import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EventTypeListComponent}     from './event-type-list.component'
import {HttpClientTestingModule}    from '@angular/common/http/testing'
import {MatIconModule}              from '@angular/material/icon'
import {MatButtonModule}            from '@angular/material/button'
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import {MatInputModule}             from '@angular/material/input'
import {EventTypeService}           from '../services/user-event-type.service'
import {EventTypeTestData}          from '../../test_data/event-types'
import {EventTypeItemComponent}     from '../event-type-item/event-type-item.component'
import {of}                         from 'rxjs'
import {UserEventType}              from '../shared/event-type.model'

describe('EventTypeListComponent', () => {
  let component: EventTypeListComponent
  let fixture: ComponentFixture<EventTypeListComponent>
  let eventTypeService: EventTypeService
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes = new EventTypeTestData()
    await TestBed.configureTestingModule({
                   imports:      [
                     HttpClientTestingModule,
                     MatIconModule,
                     MatButtonModule,
                     MatDialogModule,
                     MatInputModule
                   ],
                   declarations: [EventTypeListComponent, EventTypeItemComponent],
                   providers:    [EventTypeService]
                 })
                 .compileComponents()
    eventTypeService = TestBed.inject(EventTypeService)
    fixture          = TestBed.createComponent(EventTypeListComponent)
    component        = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set event-type-item border color from event-type-item settings', () => {
    eventTypeService.eventTypes$.next([testEventTypes.reading])
    fixture.detectChanges()
    const eventTypeItem = fixture.debugElement.nativeElement.querySelector('.event-type-item')
    expect(eventTypeItem).not.toBeNull()
    expect(eventTypeItem.getAttribute('style')).toContain('border-color: rgb(188, 203, 247)')
  })

  it('should render all event type items that are emitted by service', () => {
    eventTypeService.eventTypes$.next([testEventTypes.reading, testEventTypes.badSleep])
    fixture.detectChanges()
    const eventTypeItems = fixture.debugElement.nativeElement.querySelectorAll('.event-type-item')
    expect(eventTypeItems).not.toBeNull()
    expect(eventTypeItems.length).toEqual(2)

    const titles: NodeList = fixture.debugElement.nativeElement.querySelectorAll('.event-type-title')
    expect(titles).not.toBeNull()
    expect(titles.length).toEqual(2)
    let readingFound  = false
    let badSleepFound = false
    titles.forEach(node => {
      if (node.textContent === testEventTypes.reading.name)
        readingFound = true
      if (node.textContent === testEventTypes.badSleep.name)
        badSleepFound = true
    })
    expect(readingFound).toBeTrue()
    expect(badSleepFound).toBeTrue()
  })

  it('onDeleteEventType should emit types without deleted one', done => {
    eventTypeService.eventTypes$.next([testEventTypes.reading, testEventTypes.badSleep])
    fixture.detectChanges()
    component.onDeleteEventType(testEventTypes.badSleep)
    eventTypeService.eventTypes$.subscribe(types => {
      expect(types.length).toEqual(1)
      expect(types[0].id).toEqual(testEventTypes.reading.id)
      done()
    })
  })

  it('onCreateEventType when dialog canceled should not emit new event-type', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed : of<boolean>(false),
      close: null
    })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService.eventTypes$, 'next')
    component.onCreateEventType()
    expect(eventTypeService.eventTypes$.next).not.toHaveBeenCalled()
  })

  it('onCreateEventType when dialog canceled should not emit new event-type', () => {
    let dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed : of<UserEventType>(new UserEventType()),
      close: null
    })
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    spyOn(eventTypeService.eventTypes$, 'next')
    component.onCreateEventType()
    expect(eventTypeService.eventTypes$.next).toHaveBeenCalledTimes(1)
  })
})

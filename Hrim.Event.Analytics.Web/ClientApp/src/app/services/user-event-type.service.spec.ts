import {EventTypeService} from "./user-event-type.service";
import {TestBed}          from "@angular/core/testing";
import {LogService}       from "./log.service";
import {EVENT_TYPES}      from "../../test_data/event-types";
import {environment}      from "../../environments/environment";

import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";


describe('EventTypeService', () => {

  let service: EventTypeService
  let httpTestingController: HttpTestingController
  const url       = `${environment.apiUrl}/v1/event-type/`;
  const entityUrl = `${environment.apiUrl}/v1/entity/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
                                     imports  : [HttpClientTestingModule],
                                     providers: [LogService]
                                   })
    service               = TestBed.inject(EventTypeService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should load all event types', (done) => {
    service.eventTypes$.subscribe(eventTypes => {
      expect(eventTypes).toBeTruthy()
      expect(eventTypes.length).toBe(Object.keys(EVENT_TYPES).length)
      done()
    })
    service.load()
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('GET')
    req.flush(Object.values(EVENT_TYPES))
  })

  it('after loading event types should set typesInfo', (done) => {
    service.load()
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('GET')
    req.flush(Object.values(EVENT_TYPES))
    expect(service.typesInfo).toBeTruthy()
    for (let typeName in EVENT_TYPES) {
      const typeId = EVENT_TYPES[typeName].id
      expect(service.typesInfo[typeId]).toBeTruthy()
      expect(service.typesInfo[typeId].eventType).toEqual(EVENT_TYPES[typeName])
      expect(service.typesInfo[typeId].isSelected).toBeFalse()
    }
    done()
  })

  it('after loading event types should reset typesInfo', (done) => {
    service.updateTypeInfo(EVENT_TYPES['reading'], false)
    service.updateTypeInfo(EVENT_TYPES['yogaPractice'], false)

    service.load()
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('GET')
    req.flush([EVENT_TYPES['successfulTroubleshooting']])
    const typeId = EVENT_TYPES['successfulTroubleshooting'].id

    expect(service.typesInfo).toBeTruthy()
    expect(Object.keys(service.typesInfo).length).toEqual(1)
    expect(service.typesInfo[typeId]).toBeTruthy()
    expect(service.typesInfo[typeId].eventType).toEqual(EVENT_TYPES['successfulTroubleshooting'])
    expect(service.typesInfo[typeId].isSelected).toBeFalse()
    done()
  })

  it('after loading event types should save type info of existed types', (done) => {
    service.updateTypeInfo(EVENT_TYPES['reading'], true)
    service.updateTypeInfo(EVENT_TYPES['yogaPractice'], false)

    service.load()
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('GET')
    req.flush([EVENT_TYPES['reading']])
    const typeId = EVENT_TYPES['reading'].id

    expect(service.typesInfo).toBeTruthy()
    expect(Object.keys(service.typesInfo).length).toEqual(1)
    expect(service.typesInfo[typeId]).toBeTruthy()
    expect(service.typesInfo[typeId].eventType).toEqual(EVENT_TYPES['reading'])
    expect(service.typesInfo[typeId].isSelected).toBeTrue()
    done()
  })

  it('updateTypeInfo should add new event type info', () => {
    service.updateTypeInfo(EVENT_TYPES['reading'], true)
    const typeId = EVENT_TYPES['reading'].id

    expect(service.typesInfo).toBeTruthy()
    expect(Object.keys(service.typesInfo).length).toEqual(1)
    expect(service.typesInfo[typeId]).toBeTruthy()
    expect(service.typesInfo[typeId].eventType).toEqual(EVENT_TYPES['reading'])
    expect(service.typesInfo[typeId].isSelected).toBeTrue()
  })

  it('updateTypeInfo should update existed event type info', () => {
    service.updateTypeInfo(EVENT_TYPES['reading'], false)
    service.updateTypeInfo(EVENT_TYPES['reading'], true)
    const typeId = EVENT_TYPES['reading'].id

    expect(service.typesInfo).toBeTruthy()
    expect(Object.keys(service.typesInfo).length).toEqual(1)
    expect(service.typesInfo[typeId]).toBeTruthy()
    expect(service.typesInfo[typeId].eventType).toEqual(EVENT_TYPES['reading'])
    expect(service.typesInfo[typeId].isSelected).toBeTrue()
  })

  it('should get details for event type by id', (done) => {
    service.getDetails(EVENT_TYPES["reading"].id)
           .subscribe(eventType => {
             expect(eventType).toBeTruthy()
             expect(eventType.id).toBe(EVENT_TYPES["reading"].id)
             done()
           })
    const req = httpTestingController.expectOne(url + EVENT_TYPES["reading"].id)
    expect(req.request.method).toEqual('GET')
    req.flush({...EVENT_TYPES["reading"]})
  })

  it('should soft delete an event type by id', (done) => {
    service.deleteEventType(EVENT_TYPES["reading"])
           .subscribe(eventType => {
             expect(eventType).toBeTruthy()
             expect(eventType.id).toBe(EVENT_TYPES["reading"].id)
             done()
           })
    const deleteUrl = `${entityUrl}${EVENT_TYPES["reading"].id}?entity_type=event_type`
    const req       = httpTestingController.expectOne(deleteUrl)
    expect(req.request.method).toEqual('DELETE')
    req.flush({...EVENT_TYPES["reading"]})
  })

  it('should update an existed event type by id', (done) => {
    service.saveEventType({...EVENT_TYPES["reading"]})
           .subscribe(eventType => {
             expect(eventType).toBeTruthy()
             done()
           })
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('PUT')
    req.flush({...EVENT_TYPES["reading"]})
  })

  it('should create a new event type', (done) => {
    service.saveEventType({...EVENT_TYPES["reading"], id: ''})
           .subscribe(eventType => {
             expect(eventType).toBeTruthy()
             done()
           })
    const req = httpTestingController.expectOne(url)
    expect(req.request.method).toEqual('POST')
    req.flush({...EVENT_TYPES["reading"]})
  })
})

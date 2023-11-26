import {EventTypeService} from "./user-event-type.service";
import {TestBed} from "@angular/core/testing";
import {LogService} from "./log.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {EventTypeTestData} from "../../test_data/event-types";
import {BackendUrlService} from "./backend-url.service";


describe('EventTypeService', () => {

    let service: EventTypeService
    let httpTestingController: HttpTestingController
    let testData: EventTypeTestData

    const crudApiUrl = 'https://crud.api'
    const url = `${crudApiUrl}/v1/event-type`
    const entityUrl = `${crudApiUrl}/v1/entity`

    beforeEach(() => {
        testData = new EventTypeTestData()
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LogService, BackendUrlService]
        })
        service = TestBed.inject(EventTypeService)
        httpTestingController = TestBed.inject(HttpTestingController)
        const reqCrudApi = httpTestingController.expectOne('/backend/crud')
        reqCrudApi.flush(`"${crudApiUrl}"`, {status: 200, statusText: 'Ok'})
    })

    afterEach(() => {
        httpTestingController.verify()
    })

    it('should load all event types', (done) => {
        service.eventTypes$.subscribe(eventTypes => {
            expect(eventTypes).toBeTruthy()
            expect(eventTypes.length).toBe(Object.keys(testData).length)
            done()
        })
        service.load()
        const req = httpTestingController.expectOne(url)
        expect(req.request.method).toEqual('GET')
        req.flush(Object.values(testData))
    })

    it('after loading event types should set typesInfo', (done) => {
      service.load()
      const req = httpTestingController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush(Object.values(testData))
      expect(service.typeContexts).toBeTruthy()
      for (let eventType of Object.values(testData)) {
        const typeId = eventType.id
        expect(service.typeContexts[typeId]).toBeTruthy()
        expect(service.typeContexts[typeId].entity).toEqual(eventType)
        expect(service.typeContexts[typeId].isSelected).toBeFalse()
      }
      done()
    })

    it('after loading event types should reset typesInfo', (done) => {
        service.updateTypeContext(testData.reading, false)
        service.updateTypeContext(testData.yogaPractice, false)

        service.load()
        const req = httpTestingController.expectOne(url)
        expect(req.request.method).toEqual('GET')
        req.flush([testData.successfulTroubleshooting])
        const typeId = testData.successfulTroubleshooting.id

        expect(service.typeContexts).toBeTruthy()
        expect(Object.keys(service.typeContexts).length).toEqual(1)
        expect(service.typeContexts[typeId]).toBeTruthy()
        expect(service.typeContexts[typeId].entity).toEqual(testData.successfulTroubleshooting)
        expect(service.typeContexts[typeId].isSelected).toBeFalse()
        done()
    })

    it('after loading event types should save type info of existed types', (done) => {
      service.updateTypeContext(testData.reading, true)
      service.updateTypeContext(testData.yogaPractice, false)

      service.selectedTypesInfo$.subscribe({
        next: () => {
          expect(service.typeContexts).toBeTruthy()
          expect(Object.keys(service.typeContexts).length).toEqual(1)
          expect(service.typeContexts[testData.reading.id]).toBeTruthy()
          expect(service.typeContexts[testData.reading.id].entity).toEqual(testData.reading)
          expect(service.typeContexts[testData.reading.id].isSelected).toBeTrue()
          done()
        }
      })

      service.load()
      const req = httpTestingController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush([testData.reading])
    })

    it('updateTypeInfo should add new event type info', () => {
        service.updateTypeContext(testData.reading, true)
        const typeId = testData.reading.id

        expect(service.typeContexts).toBeTruthy()
        expect(Object.keys(service.typeContexts).length).toEqual(1)
        expect(service.typeContexts[typeId]).toBeTruthy()
        expect(service.typeContexts[typeId].entity).toEqual(testData.reading)
        expect(service.typeContexts[typeId].isSelected).toBeTrue()
    })

    it('updateTypeInfo should update existed event type info', () => {
        service.updateTypeContext(testData.reading, false)
        service.updateTypeContext(testData.reading, true)
        const typeId = testData.reading.id

        expect(service.typeContexts).toBeTruthy()
        expect(Object.keys(service.typeContexts).length).toEqual(1)
        expect(service.typeContexts[typeId]).toBeTruthy()
        expect(service.typeContexts[typeId].entity).toEqual(testData.reading)
        expect(service.typeContexts[typeId].isSelected).toBeTrue()
    })

    it('should get details for event type by id', (done) => {
        service.getDetails(testData.reading.id)
            .subscribe(eventType => {
                expect(eventType).toBeTruthy()
                expect(eventType.id).toBe(testData.reading.id)
                done()
            })
        const req = httpTestingController.expectOne(`${url}/${testData.reading.id}`)
        expect(req.request.method).toEqual('GET')
        req.flush({...testData.reading})
    })

    it('should soft delete an event type by id', (done) => {
        service.delete(testData.reading)
            .subscribe(eventType => {
                expect(eventType).toBeTruthy()
                expect(eventType.id).toBe(testData.reading.id)
                done()
            })
        const deleteUrl = `${entityUrl}/${testData.reading.id}?entity_type=event_type`
        const req = httpTestingController.expectOne(deleteUrl)
        expect(req.request.method).toEqual('DELETE')
        req.flush({...testData.reading})
    })

    it('should update an existed event type by id', (done) => {
        service.save({...testData.reading})
            .subscribe(eventType => {
                expect(eventType).toBeTruthy()
                done()
            })
        const req = httpTestingController.expectOne(url)
        expect(req.request.method).toEqual('PUT')
        req.flush({...testData.reading})
    })

    it('should create a new event type', (done) => {
        service.save({...testData.reading, id: ''})
            .subscribe(eventType => {
                expect(eventType).toBeTruthy()
                done()
            })
        const req = httpTestingController.expectOne(url)
        expect(req.request.method).toEqual('POST')
        req.flush({...testData.reading})
    })
})

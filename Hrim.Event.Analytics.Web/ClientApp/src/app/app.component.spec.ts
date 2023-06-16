import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LogService} from "./services/log.service";
import {BackendUrlService} from "./services/backend-url.service";
import {EventTypeService} from "./services/user-event-type.service";

describe('AppComponent', () => {
    let httpTestingController: HttpTestingController

    const crudApiUrl = '"https://crud.api"'
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [HttpClientTestingModule],
            providers: [LogService, BackendUrlService]
        })
        httpTestingController = TestBed.inject(HttpTestingController)
        const urlService = TestBed.inject(BackendUrlService)
        const reqCrudApi = httpTestingController.expectOne('/backend/crud')
        reqCrudApi.flush(crudApiUrl, {status: 200, statusText: 'Ok'})
    });
    
    afterEach(() => {
        httpTestingController.verify()
    })
    
    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});

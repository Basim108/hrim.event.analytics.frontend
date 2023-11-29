import {TestBed} from '@angular/core/testing';

import {BackendUrlService} from './backend-url.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LogService} from "./log.service";
import {MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('BackendUrlAccessorService', () => {
    let service: BackendUrlService;
    let httpTestingController: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports  : [
              HttpClientTestingModule,
              MatDialogModule,
              NoopAnimationsModule,
              MatSnackBarModule
            ],
            providers: [LogService]
        })
        service               = TestBed.inject(BackendUrlService)
        httpTestingController = TestBed.inject(HttpTestingController)
        const reqAccessToken = httpTestingController.expectOne('/backend/crud')
        reqAccessToken.flush('"https://crud.api"', {status: 200, statusText: 'Ok'})
    })

    afterEach(() => {
        httpTestingController.verify()
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

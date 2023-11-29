import {TestBed} from '@angular/core/testing';

import {ApiRequestInterceptor} from './api-request-interceptor.service';
import {MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ApiRequestInterceptorService', () => {
    let service: ApiRequestInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
          imports:[
            MatDialogModule,
            NoopAnimationsModule,
            MatSnackBarModule
          ]
        });
        service = TestBed.inject(ApiRequestInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

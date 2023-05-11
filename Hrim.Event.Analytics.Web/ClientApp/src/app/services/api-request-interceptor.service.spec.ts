import {TestBed} from '@angular/core/testing';

import {ApiRequestInterceptor} from './api-request-interceptor.service';

describe('ApiRequestInterceptorService', () => {
    let service: ApiRequestInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ApiRequestInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

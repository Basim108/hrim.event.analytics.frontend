import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {LogService} from "./log.service";

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports     : [
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
      providers   : [LogService]
    })
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

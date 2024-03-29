import { TestBed } from '@angular/core/testing';

import { ErrorMetadataService } from './error-metadata.service';
import {LogService} from "./log.service";
import {MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ErrorMetadataService', () => {
  let service: ErrorMetadataService;
  let logService: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
      providers: [LogService]
    });
    logService = TestBed.inject(LogService);
    spyOn(logService, 'error')
    service = TestBed.inject(ErrorMetadataService);
  });

  it('should be created/resolved', () => {
    expect(service).toBeTruthy();
  });

  it('should log error message when an error was handled', () => {
    const error = new Error('ERROR')
    service.handleError(error)
    expect(logService.error).toHaveBeenCalledWith('ERROR',
      jasmine.anything());
  });

  it('should log timestamp when an error was handled', () => {
    const error = new Error('ERROR')
    service.handleError(error)
    expect(logService.error).toHaveBeenCalledWith(jasmine.anything(),
      jasmine.objectContaining({
      timestamp: jasmine.notEmpty()
    }));
  });

  it('should log error message in the details when an error was handled', () => {
    const error = new Error('ERROR')
    service.handleError(error)
    expect(logService.error).toHaveBeenCalledWith(jasmine.anything(),
      jasmine.objectContaining({
        message: 'ERROR'
      }));
  });
});

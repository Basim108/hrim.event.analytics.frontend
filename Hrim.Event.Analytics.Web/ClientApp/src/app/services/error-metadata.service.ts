import {ErrorHandler, Injectable} from '@angular/core';
import {LogService} from "./log.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorMetadataService implements ErrorHandler {
  constructor(private logger: LogService) {
  }

  handleError(error: any): void {
    this.logger.error(error.message, {
      timestamp: new Date().toISOString(),
      message: error.message,
      zone: error.zone
    })
  }
}

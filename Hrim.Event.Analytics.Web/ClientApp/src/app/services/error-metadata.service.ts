import {ErrorHandler, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMetadataService implements ErrorHandler {
  handleError(error: any): void {
    console.error({
      timestamp: new Date().toISOString(),
      message: error.message,
      zone: error.zone
    })
  }
}

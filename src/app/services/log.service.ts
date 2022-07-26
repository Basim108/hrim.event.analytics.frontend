import {Injectable, isDevMode} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {
    console.log('LogService constructor');
  }

  log(message: string, includeProd?: boolean): void {
    const shouldLog = includeProd || isDevMode();
    if (shouldLog)
      console.log(message)
  }
}

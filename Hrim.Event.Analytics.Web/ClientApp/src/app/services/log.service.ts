import {isDevMode} from '@angular/core';
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class LogService {
  constructor() {
    this.logConstructor(this);
  }

  logConstructor(obj: object){
    this.debug(`${obj.constructor.name} constructor`, obj)
  }

  log(msg: any, ...params: any[]) {
    console.log(msg, ...params)
  }

  debug(msg: any, ...params: any[]) {
    if (isDevMode())
      console.debug(msg, ...params)
  }

  info(msg: any, ...params: any[]) {
    console.info(msg, ...params)
  }

  warn(msg: any, ...params: any[]) {
    console.warn(msg, ...params)
  }

  error(msg: any, ...params: any[]) {
    console.error(msg, ...params)
  }
}

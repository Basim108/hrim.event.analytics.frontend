import {Injectable} from '@angular/core';
import {HrimEventModel} from "../shared/hrim-event.model";
import {ReplaySubject} from "rxjs";
import {LogService} from "./log.service";

@Injectable({ providedIn: 'root'})
export class HrimEventService {
  hrimEvents$= new ReplaySubject<HrimEventModel>()

  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }

  createEvent(model: HrimEventModel): void {
    model.id = crypto.randomUUID()
    this.hrimEvents$.next(model)
  }
}

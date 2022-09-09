import {Injectable} from '@angular/core';
import {HrimEventModel} from "../shared/hrim-event.model";
import {GuidService} from "./guid.service";
import {ReplaySubject} from "rxjs";
import {LogService} from "./log.service";

@Injectable({ providedIn: 'root'})
export class HrimEventService {
  hrimEvents$= new ReplaySubject<HrimEventModel>()

  constructor(private logger: LogService, private guidService: GuidService) {
    logger.logConstructor(this);
  }

  createEvent(model: HrimEventModel): void {
    model.id = this.guidService.generate();
    this.hrimEvents$.next(model);
  }
}

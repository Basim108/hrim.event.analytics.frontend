import {EventEmitter, Injectable} from '@angular/core';
import {HrimEventModel} from "../shared/hrim-event.model";
import {GuidService} from "./guid.service";
import {ReplaySubject, Subject, of} from "rxjs";
import {LogService} from "./log.service";

@Injectable({ providedIn: 'root'})
export class HrimEventService {
  hrimEvents$= new ReplaySubject<HrimEventModel>()
  // created$= new ReplaySubject<HrimEventModel>();
  // deleted$= new Subject<HrimEventModel>();

  constructor(private logger: LogService, private guidService: GuidService) {
    logger.logConstructor(this);
  }

  createEvent(model: HrimEventModel): void {
    model.id = this.guidService.generate();
    this.hrimEvents$.next(model);
  }

  // deleteEvent(id: string): void {
  //   const deleteItemIndex = this.hrimEvents.findIndex(item => item.id === id);
  //   const deletedItem = this.hrimEvents[deleteItemIndex];
  //   this.hrimEvents.splice(deleteItemIndex, 1);
  //   this.hrimEventDeleted.emit(deletedItem);
  // }
}

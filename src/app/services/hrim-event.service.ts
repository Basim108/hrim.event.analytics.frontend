import {EventEmitter, Injectable} from '@angular/core';
import {HrimEventModel} from "../shared/hrim-event.model";
import {GuidService} from "./guid.service";
import {LogService} from "./log.service";
import {ReplaySubject, Subject, of} from "rxjs";

@Injectable({ providedIn: 'root'})
export class HrimEventService {
  hrimEvents$= new ReplaySubject<HrimEventModel>()
  // created$= new ReplaySubject<HrimEventModel>();
  // deleted$= new Subject<HrimEventModel>();

  constructor(private guidService: GuidService,
              private logger: LogService) {
    logger.log('HrimEventService constructor');
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

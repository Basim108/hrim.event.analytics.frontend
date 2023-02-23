import {Component, Input}        from '@angular/core'
import {BaseEventModel}          from '../../../shared/base-event.model'
import {OccurrenceEventModel}    from "../../../shared/occurrence-event.model";
import {EventTypeDetailsDialog}  from "../../../event-type-details-dialog/event-type-details-dialog.component";
import {EventTypeDetailsRequest} from "../../../event-type-details-dialog/event-type-details-request";
import {MatDialog}               from "@angular/material/dialog";

@Component({
             selector   : 'app-event-of-day',
             templateUrl: './event-of-day.component.html',
             styleUrls  : ['./event-of-day.component.css']
           })
export class EventOfDayComponent {
  @Input() eventOfDay: BaseEventModel;
  @Input() totalEventCount: number;
  @Input() prevEventOfDay: BaseEventModel | null;

  constructor(public editDialog: MatDialog) {
  }

  getEventHeight() {
    return (100 / this.totalEventCount) + '%';
  }

  getEventInfo() {
    const eventKind = this.eventOfDay instanceof OccurrenceEventModel
                      ? 'occurrence'
                      : 'duration'
    return `${eventKind}: ${this.eventOfDay.eventType.name}\nid: ${this.eventOfDay.id}`
  }


  onEditEventType() {
    // const dialogRef = this.editDialog.open(EventTypeDetailsDialog, {
    //   data: new EventDetailsRequest(this.eventOfDay, true)
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.eventType = result;
    //     this.eventTypeService.saveEventType(result);
    //   }
    // });
  }

  onDeleteEventType() {
    // this.deleteEventTypeSub = this.eventTypeService.deleteEventType(this.eventType).subscribe({
    //                                                                                             next: (deletedEventType) => {
    //                                                                                               if (deletedEventType.is_deleted)
    //                                                                                                 this.delete.emit(this.eventType)
    //                                                                                             }
    //                                                                                           });
  }

  getTopBorderStyle() {
    return this.prevEventOfDay?.eventType.color === this.eventOfDay.eventType.color ?? false
           ? 'dashed black 1px'
           : 'none'
  }
}

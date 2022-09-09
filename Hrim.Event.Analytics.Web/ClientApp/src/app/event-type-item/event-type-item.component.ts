import {Component, Input} from '@angular/core';
import {LogService} from "../services/log.service";
import {MatDialog} from "@angular/material/dialog";
import {EventTypeDetailsDialog} from "../event-type-details-dialog/event-type-details-dialog.component";
import {EventTypeDetailsRequest} from "../event-type-details-dialog/event-type-details-request";
import {EventTypeService} from "../services/user-event-type.service";
import {UserEventType} from "./event-type.model";

@Component({
             selector: 'app-event-type-item',
             templateUrl: './event-type-item.component.html',
             styleUrls: ['./event-type-item.component.css']
           })
export class EventTypeItemComponent {
  @Input('eventType') eventType: UserEventType;

  constructor(public editDialog: MatDialog,
    private eventTypeService: EventTypeService,
    private logger: LogService) {
    logger.logConstructor(this)
  }

  onEditEventType() {
    const dialogRef = this.editDialog.open(EventTypeDetailsDialog, {
      data: new EventTypeDetailsRequest(this.eventType, true)
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventType = result;
        this.eventTypeService.saveEventType(result);
      }
    });
  }

  onDeleteEventType() {
    // TODO: implement in the HC-44 task
  }
}

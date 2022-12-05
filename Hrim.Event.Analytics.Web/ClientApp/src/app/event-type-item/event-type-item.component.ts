import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {LogService} from "../services/log.service";
import {MatDialog} from "@angular/material/dialog";
import {EventTypeDetailsDialog} from "../event-type-details-dialog/event-type-details-dialog.component";
import {EventTypeDetailsRequest} from "../event-type-details-dialog/event-type-details-request";
import {EventTypeService} from "../services/user-event-type.service";
import {UserEventType} from "./event-type.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-event-type-item',
  templateUrl: './event-type-item.component.html',
  styleUrls: ['./event-type-item.component.css']
})
export class EventTypeItemComponent implements OnDestroy {
  @Input('eventType') eventType: UserEventType;
  @Output() delete = new EventEmitter<UserEventType>;

  deleteEventTypeSub: Subscription;

  constructor(public editDialog: MatDialog,
              private eventTypeService: EventTypeService,
              private logger: LogService) {
    logger.logConstructor(this)
  }

  ngOnDestroy(): void {
    this.deleteEventTypeSub.unsubscribe();
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
    this.deleteEventTypeSub = this.eventTypeService.deleteEventType(this.eventType).subscribe({
      next: (deletedEventType) => {
        if (deletedEventType.is_deleted)
          this.delete.emit(this.eventType)
      }
    });
  }
}

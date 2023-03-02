import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LogService}                                     from "../services/log.service";
import {MatDialog}                                      from "@angular/material/dialog";
import {EventTypeDetailsDialog}        from "../dialogs/event-type-details-dialog/event-type-details-dialog.component";
import {EventTypeDetailsDialogRequest} from "../shared/dialogs/event-type-details-dialog-request";
import {EventTypeService}              from "../services/user-event-type.service";
import {UserEventType}                                  from "../shared/event-type.model";

@Component({
             selector   : 'app-event-type-item',
             templateUrl: './event-type-item.component.html',
             styleUrls  : ['./event-type-item.component.css']
           })
export class EventTypeItemComponent implements OnInit {
  @Input('eventType') eventType: UserEventType;
  @Output() delete    = new EventEmitter<UserEventType>;
  isSelected: boolean = false

  constructor(public editDialog: MatDialog,
              private eventTypeService: EventTypeService,
              private logger: LogService) {
    logger.logConstructor(this)
  }

  ngOnInit() {
    this.logger.debug('event-type-item initialization')
    this.isSelected = this.eventTypeService.typeContexts[this.eventType.id]?.isSelected ?? false
  }

  onEditEventType() {
    const dialogRef = this.editDialog.open(EventTypeDetailsDialog, {
      data: new EventTypeDetailsDialogRequest(this.eventType, true)
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventType = result;
      }
    });
  }

  onDeleteEventType() {
    this.eventTypeService
        .deleteEventType(this.eventType)
        .subscribe({
                     next: (deletedEventType) => {
                       if (deletedEventType.is_deleted) {
                         this.delete.emit(this.eventType)
                       }
                     }
                   });
  }

  toggleEventType() {
    this.isSelected = !this.isSelected
    this.eventTypeService.updateTypeContext(this.eventType, this.isSelected)
  }
}

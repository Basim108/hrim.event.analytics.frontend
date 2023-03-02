import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core'
import {OccurrenceEventModel}                                      from "../../../shared/occurrence-event.model";
import {SomeEventModel}                                            from "../../../shared/some-event.model";
import {EventTypeService}                                          from "../../../services/user-event-type.service";
import {Subscription}                                              from "rxjs";
import {LogService}                                                from "../../../services/log.service";
import {HrimEventService}                                          from "../../../services/hrim-event.service";
import {EventDetailsDialog}                                        from "../../../dialogs/event-details-dialog/event-details-dialog.component";
import {MatDialog}                                                 from "@angular/material/dialog";
import {EventDetailsDialogRequest}                                 from "../../../shared/dialogs/event-details-dialog-request";

@Component({
             selector   : 'app-event-of-day',
             templateUrl: './event-of-day.component.html',
             styleUrls  : ['./event-of-day.component.css']
           })
export class EventOfDayComponent implements OnInit, OnDestroy {
  @Input() eventOfDay: SomeEventModel;
  @Input() totalEventCount: number;
  @Input() isSelected: boolean;
  @Input() prevEventOfDay: SomeEventModel | null;
  @Output() delete: EventEmitter<SomeEventModel> = new EventEmitter<SomeEventModel>()

  isVisible = false

  selectedTypesSub: Subscription

  constructor(private eventTypeService: EventTypeService,
              private eventService: HrimEventService,
              private detailsDialog: MatDialog,
              private logger: LogService) {
  }

  ngOnInit() {
    this.selectedTypesSub = this.eventTypeService
                                .selectedTypesInfo$
                                .subscribe(() => this.eventTypeSelectionChanged())
  }

  ngOnDestroy() {
    this.selectedTypesSub?.unsubscribe()
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

  onEdit($event: any) {
    this.logger.debug('event-of-day edit clicked')
    $event.stopPropagation()
    const dialogRef = this.detailsDialog.open(EventDetailsDialog, {
      data: new EventDetailsDialogRequest(this.eventOfDay, true)
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const typeContext = this.eventTypeService.typeContexts[result.eventType.id]
        this.isVisible    = typeContext.isSelected
        this.eventOfDay   = result;
      }
    });
  }

  onDelete($event: any) {
    this.logger.debug('event-of-day delete clicked')
    $event.stopPropagation()
    this.eventService
        .deleteEvent(this.eventOfDay)
        .subscribe({
                     next : () => {
                       delete this.eventService.eventContext[this.eventOfDay.id]
                       this.delete.emit(this.eventOfDay)
                     },
                     error: err => {
                       const eventContext     = this.eventService.eventContext[this.eventOfDay.id]
                       eventContext.isDeleted = true
                       eventContext.isUnsaved = true
                       this.logger.error('Failed to delete event: ' + err, this.eventOfDay, eventContext)
                     }
                   });
  }

  getTopBorderStyle() {
    return this.prevEventOfDay?.eventType.color === this.eventOfDay.eventType.color ?? false
           ? 'dashed black 1px'
           : 'none'
  }

  private eventTypeSelectionChanged() {
    const typeInfo = this.eventTypeService.typeContexts[this.eventOfDay.eventType.id]
    this.isVisible = typeInfo?.isSelected ?? false
  }

  onClick($event: any) {
    $event.stopPropagation()
    this.logger.debug('event-of-day clicked')
  }
}

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core'
import {OccurrenceEventModel}                                      from "../../../shared/occurrence-event.model";
import {SomeEventModel}                                            from "../../../shared/some-event.model";
import {EventTypeService}                                          from "../../../services/user-event-type.service";
import {Subscription}                                              from "rxjs";
import {LogService}                                                from "../../../services/log.service";
import {HrimEventService}                                          from "../../../services/hrim-event.service";
import {OccurrenceEventDetailsDialog}                              from "../../../dialogs/occurrence-event-details-dialog/occurrence-event-details-dialog";
import {MatDialog}                                                 from "@angular/material/dialog";
import {OccurrenceEventDetailsDialogRequest}                       from "../../../shared/dialogs/occurrence-event-details-dialog-request";
import {DurationEventDetailsDialog}                                from "../../../dialogs/duration-event-details-dialog/duration-event-details-dialog";
import {DurationEventDetailsDialogRequest}                         from "../../../shared/dialogs/duration-event-details-dialog-request";
import {NotificationService} from "../../../services/notification.service";

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
  @Output() changed: EventEmitter<SomeEventModel> = new EventEmitter<SomeEventModel>()

  isVisible = false

  selectedTypesSub: Subscription

  constructor(private eventTypeService: EventTypeService,
              private eventService: HrimEventService,
              private detailsDialog: MatDialog,
              private notificationService: NotificationService,
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
    $event.stopPropagation()
    const dialogRef = this.eventOfDay instanceof OccurrenceEventModel
                      ? this.detailsDialog.open(OccurrenceEventDetailsDialog, {
        data: new OccurrenceEventDetailsDialogRequest({...this.eventOfDay}, true)
      })
                      : this.detailsDialog.open(DurationEventDetailsDialog, {
        data: new DurationEventDetailsDialogRequest({...this.eventOfDay}, true)
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const typeContext = this.eventTypeService.typeContexts[result.eventType.id]
        this.isVisible    = typeContext.isSelected
        this.eventOfDay   = result;
        this.changed.emit(result)
      }
    });
  }

  onDelete($event: any) {
    $event.stopPropagation()
    const eventKind = this.eventOfDay.isOccurrence ? 'occurrence' : 'duration'
    if(window.confirm(`Are sure you want to delete "${this.eventOfDay.eventType.name}" ${eventKind}?`)) {
      this.eventService
        .deleteEvent(this.eventOfDay)
        .subscribe({
          next: () => {
            delete this.eventService.eventContext[this.eventOfDay.id]
            this.delete.emit(this.eventOfDay)
            this.notificationService.success(`Successfully deleted`)
          },
          error: err => {
            const eventContext = this.eventService.eventContext[this.eventOfDay.id]
            eventContext.isDeleted = true
            eventContext.isUnsaved = true
            this.notificationService.error(`Failed to save deletion`)
            this.logger.error('Failed to delete event: ' + err, this.eventOfDay, eventContext)
          }
        });
    }
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
}

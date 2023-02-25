import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {OccurrenceEventModel}                from "../../../shared/occurrence-event.model";
import {SomeEventModel}                      from "../../../shared/some-event.model";
import {EventTypeService}                    from "../../../services/user-event-type.service";
import {Subscription}                        from "rxjs";
import {LogService}                          from "../../../services/log.service";

@Component({
             selector   : 'app-event-of-day',
             templateUrl: './event-of-day.component.html',
             styleUrls  : ['./event-of-day.component.css']
           })
export class EventOfDayComponent implements OnInit, OnDestroy {
  @Input() eventOfDay: SomeEventModel;
  @Input() totalEventCount: number;
  @Input() prevEventOfDay: SomeEventModel | null;

  isShown = false

  selectedTypesSub: Subscription

  constructor(private eventTypeService: EventTypeService,
              private logger: LogService) {
  }

  ngOnInit() {
    this.selectedTypesSub = this.eventTypeService.selectedTypesInfo$
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

  private eventTypeSelectionChanged() {
    const typeInfo = this.eventTypeService.typesInfo[this.eventOfDay.eventType.id]
    this.isShown = typeInfo?.isSelected ?? false
  }
}

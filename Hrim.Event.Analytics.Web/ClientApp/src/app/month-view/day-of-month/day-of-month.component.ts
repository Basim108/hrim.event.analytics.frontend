import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {DayModel} from "../../shared/day.model";
import {DateTime} from "luxon";
import {LogService} from "../../services/log.service";
import {EventOfDayModel} from "../../event-of-day/event-of-day.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogDetailsRequest} from "../../shared/dialog-details-request";
import {EventOccurrenceDetailsDialog} from "../../event-occurrence-details-dialog/event-occurrence-details-dialog.component";
import {EventDurationDetailsDialog} from "../../event-duration-details-dialog/event-duration-details-dialog.component";
import {AnyEvent, DurationEvent, OccurrenceEvent} from "../../shared/events.model";
import {Subscription} from "rxjs";
import {HrimEventService} from "../../services/hrim-event.service";
import {filter} from "rxjs/operators";

const DURATION_KIND_ID = 1
const OCCURRENCE_KIND_ID = 2

type EventKind = 1 | 2

@Component({
  selector: 'app-day-of-month',
  templateUrl: './day-of-month.component.html',
  styleUrls: ['./day-of-month.component.css']
})
export class DayOfMonthComponent implements OnInit, OnDestroy {
  @Input('day') dayModel!: DayModel;
  @Input() isLastWeek!: boolean;
  @Input() currentMonth!: DateTime;
  events: EventOfDayModel<AnyEvent>[];
  eventsSub: Subscription

  durationKindId: EventKind = DURATION_KIND_ID
  occurrenceKindId: EventKind = OCCURRENCE_KIND_ID

  isOutOfMonth: boolean;
  isToday: boolean;

  @HostBinding('class.last-week') get lastWeek() {
    return this.isLastWeek
  }

  @HostBinding('class.out-of-month') get outOfMonth() {
    return this.isOutOfMonth
  }

  constructor(private logger: LogService,
              private eventService: HrimEventService,
              public createDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isToday = this.dayModel.dateTime.toISODate() === DateTime.now().toISODate();
    this.isOutOfMonth = this.dayModel.dateTime.month !== this.currentMonth.month || this.dayModel.dateTime.year !== this.currentMonth.year;
    this.events = []
    this.eventsSub = this.eventService.events$
                         .pipe(filter(eventOfDay =>
                           eventOfDay.date.year == this.dayModel.year &&
                           eventOfDay.date.month == this.dayModel.month &&
                           eventOfDay.date.day == this.dayModel.day))
                         .subscribe({
                           next: eventOfDay => this.events.push(eventOfDay)
                         })
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe()
  }

  @HostListener("click") onClick() {

  }

  createEvent(kind: EventKind) {
    let event: AnyEvent
    let dialog: any
    let kindName: string
    switch (kind) {
      case DURATION_KIND_ID:
        event = new DurationEvent()
        event.started_at = `${this.dayModel.dateTime.toISODate()} ${DateTime.now().toISOTime()}`
        dialog = EventDurationDetailsDialog
        kindName = 'duration'
        break;
      case OCCURRENCE_KIND_ID:
        event = new OccurrenceEvent()
        event.occurred_at = `${this.dayModel.dateTime.toISODate()} ${DateTime.now().toISOTime()}`
        dialog = EventOccurrenceDetailsDialog
        kindName = 'occurrence'
        break;
      default:
        throw new Error(`Unsupported kind of event: ${kind}. Expected: duration=${DURATION_KIND_ID}, occurrence=${OCCURRENCE_KIND_ID}`)
    }

    const dialogRef = this.createDialog.open(dialog, {
      data: new DialogDetailsRequest(false, event)
    });
    dialogRef.afterClosed().subscribe({
      next: createdEntity => {
        this.eventService.events$.next(createdEntity)
      }
    });
  }
}

import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {DayModel} from "../../shared/day.model";
import {DateTime} from "luxon";
import {HrimEventService} from "../../services/hrim-event.service";
import {LogService} from "../../services/log.service";
import {EventOfDayModel} from "../../event-of-day/event-of-day.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogDetailsRequest} from "../../shared/dialog-details-request";
import {EventOccurrenceDetailsDialog} from "../../event-occurrence-details-dialog/event-occurrence-details-dialog.component";
import {EventDurationDetailsDialog} from "../../event-duration-details-dialog/event-duration-details-dialog.component";
import {DurationEvent, OccurrenceEvent} from "../../shared/events.model";

const DURATION_KIND_ID = 1
const OCCURRENCE_KIND_ID = 2

@Component({
  selector: 'app-day-of-month',
  templateUrl: './day-of-month.component.html',
  styleUrls: ['./day-of-month.component.css']
})
export class DayOfMonthComponent implements OnInit {
  @Input('day') dayModel!: DayModel;
  @Input() isLastWeek!: boolean;
  @Input() currentMonth!: DateTime;
  @Input() events: EventOfDayModel[];
  kinds = [
    {id: DURATION_KIND_ID, name: 'Duration'},
    {id: OCCURRENCE_KIND_ID, name: 'Occurrence'}
  ]

  isOutOfMonth: boolean;
  isToday: boolean;

  @HostBinding('class.last-week') get lastWeek() {
    return this.isLastWeek
  }

  @HostBinding('class.out-of-month') get outOfMonth() {
    return this.isOutOfMonth
  }

  constructor(private logger: LogService,
              public createDialog: MatDialog,
              private eventService: HrimEventService) {

  }

  ngOnInit(): void {
    this.isToday = this.dayModel.dateTime.toISODate() === DateTime.now().toISODate();
    this.isOutOfMonth = this.dayModel.dateTime.month !== this.currentMonth.month || this.dayModel.dateTime.year !== this.currentMonth.year;
  }

  @HostListener("click") onClick() {

  }

  createDuration() {
    const dialogRef = this.createDialog.open(EventDurationDetailsDialog, {
      data: new DialogDetailsRequest(false, new DurationEvent())
    });
    dialogRef.afterClosed().subscribe(
      createdEntity => {
        this.logger.debug('adding a created duration event to the list', createdEntity);
        // this.eventService.createEvent(createdEntity)
      }
    );
  }

  createOccurrence() {
    const dialogRef = this.createDialog.open(EventOccurrenceDetailsDialog, {
      data: new DialogDetailsRequest(false, new OccurrenceEvent())
    });
    dialogRef.afterClosed().subscribe(
      createdEntity => {
        this.logger.debug('adding a created occurrence event to the list', createdEntity);
        // this.eventService.createEvent(createdEntity)
      }
    );
  }
}

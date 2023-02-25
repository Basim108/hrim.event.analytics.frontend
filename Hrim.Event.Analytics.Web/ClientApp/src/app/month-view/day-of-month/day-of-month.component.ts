import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core'
import {OccurrenceEventModel}                                           from 'src/app/shared/occurrence-event.model'
import {DayModel}                                                       from '../../shared/day.model'
import {DateTime}                                                       from 'luxon'
import {HrimEventService}                                               from '../../services/hrim-event.service'
import {Subscription}                                                   from 'rxjs'
import {LogService}                                                     from '../../services/log.service'
import {DurationEventModel}                                             from '../../shared/duration-event.model'
import {UserEventType}                                                  from "../../shared/event-type.model";
import {EventTypeService}                                               from "../../services/user-event-type.service";

@Component({
             selector   : 'app-day-of-month',
             templateUrl: './day-of-month.component.html',
             styleUrls  : ['./day-of-month.component.css']
           })
export class DayOfMonthComponent implements OnInit,
                                            OnDestroy {
  @Input('day') dayModel!: DayModel
  @Input() isLastWeek!: boolean
  @Input() currentMonth!: DateTime
  @Input() occurrenceEvents: OccurrenceEventModel[]
  @Input() durationEvents: DurationEventModel[]

  isOutOfMonth: boolean
  isToday: boolean

  @HostBinding('class.last-week') get lastWeek() {
    return this.isLastWeek
  }

  @HostBinding('class.out-of-month') get outOfMonth() {
    return this.isOutOfMonth
  }

  eventsSub: Subscription

  constructor(private logger: LogService,
              private eventTypeService: EventTypeService,
              private eventService: HrimEventService) {

  }

  ngOnDestroy(): void {
    this.eventsSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.isToday      = this.dayModel.dateTime.toISODate() === DateTime.now().toISODate()
    this.isOutOfMonth = this.dayModel.dateTime.month !== this.currentMonth.month || this.dayModel.dateTime.year !== this.currentMonth.year
  }

  @HostListener('click') onClick() {
    this.onEventCreated()
  }

  onEventCreated() {
    const createdEvent           = {
      id             : '',
      eventType      : new UserEventType(),
      occurredAt     : this.dayModel.dateTime,
      occurredOn     : this.dayModel.dateTime.toISODate(),
      concurrentToken: 0
    }
    createdEvent.eventType.color = '#ff00ff'
    this.eventService.createEvent(createdEvent)
  }

  getLastOccurrence() {
    const occurrenceLength = this.occurrenceEvents.length
    return occurrenceLength > 0
           ? this.occurrenceEvents[occurrenceLength - 1]
           : null
  }

  getTotalVisibleTypeCount(occurrences: OccurrenceEventModel[], durations: DurationEventModel[]) {
    const typesInfo          = this.eventTypeService.typesInfo
    const visibleOccurrences = occurrences.filter(e => typesInfo[e.eventType.id]?.isSelected)
    const visibleDurations   = durations.filter(e => typesInfo[e.eventType.id]?.isSelected)
    return visibleOccurrences.length + visibleDurations.length;
  }
}

import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core'
import {OccurrenceEventModel}                                        from 'src/app/shared/occurrence-event.model'
import {DayModel}                                                    from '../../shared/day.model'
import {DateTime}                                                    from 'luxon'
import {LogService}                                                  from '../../services/log.service'
import {DurationEventModel}                                          from '../../shared/duration-event.model'
import {EventTypeService}                                            from "../../services/user-event-type.service";
import {SomeEventModel}                                              from "../../shared/some-event.model";
import {HrimEventService}                                            from "../../services/hrim-event.service";

@Component({
             selector   : 'app-day-of-month',
             templateUrl: './day-of-month.component.html',
             styleUrls  : ['./day-of-month.component.css']
           })
export class DayOfMonthComponent implements OnInit {
  @Input('day') dayModel!: DayModel
  @Input() isLastWeek!: boolean
  @Input() currentMonth!: DateTime
  @Input() occurrenceEvents: OccurrenceEventModel[]
  @Input() durationEvents: DurationEventModel[]
  @Output() deleteEvent: EventEmitter<SomeEventModel> = new EventEmitter<SomeEventModel>()
  @Output() changeEvent: EventEmitter<SomeEventModel> = new EventEmitter<SomeEventModel>()

  isOutOfMonth: boolean
  isToday: boolean

  @HostBinding('class.last-week') get lastWeek() {
    return this.isLastWeek
  }

  @HostBinding('class.out-of-month') get outOfMonth() {
    return this.isOutOfMonth
  }

  constructor(private logger: LogService,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService) {

  }

  ngOnInit(): void {
    this.isToday      = this.dayModel.dateTime.toISODate() === DateTime.now().toISODate()
    this.isOutOfMonth = this.dayModel.dateTime.month !== this.currentMonth.month || this.dayModel.dateTime.year !== this.currentMonth.year
  }

  createOccurrenceEvent() {
    const eventTypeContexts = Object.values(this.eventTypeService.typeContexts)
    if (eventTypeContexts.length === 0) {
      alert('Before creating an event, please create an event type')
      return
    }
    const selectedTypeContext = eventTypeContexts.find(x => x.isSelected) ?? eventTypeContexts[0]
    const createdEvent        = new OccurrenceEventModel(null)
    createdEvent.id           = crypto.randomUUID() // important to match this event in the context after saving it.
    createdEvent.occurredOn   = this.dayModel.dateTime.toISODate() + 'T' + DateTime.now().toISOTime()
    createdEvent.occurredAt   = DateTime.fromISO(createdEvent.occurredOn)
    createdEvent.eventType    = selectedTypeContext.entity

    this.eventService.createEvent(createdEvent)
  }

  createDurationEvent() {
    const eventTypeContexts = Object.values(this.eventTypeService.typeContexts)
    if (eventTypeContexts.length === 0) {
      alert('Before creating an event, please create an event type')
      return
    }
    const selectedTypeContext = eventTypeContexts.find(x => x.isSelected) ?? eventTypeContexts[0]
    const createdEvent        = new DurationEventModel(null)
    createdEvent.id           = crypto.randomUUID() // important to match this event in the context after saving it.
    createdEvent.startedOn    = this.dayModel.dateTime.toISODate() + 'T' + DateTime.now().toISOTime()
    createdEvent.startedAt    = DateTime.fromISO(createdEvent.startedOn)
    createdEvent.eventType    = selectedTypeContext.entity

    this.eventService.createEvent(createdEvent)
  }

  getLastOccurrence() {
    const occurrenceLength = this.occurrenceEvents.length
    return occurrenceLength > 0
           ? this.occurrenceEvents[occurrenceLength - 1]
           : null
  }

  getTotalVisibleTypeCount(occurrences: OccurrenceEventModel[], durations: DurationEventModel[]) {
    const typesInfo          = this.eventTypeService.typeContexts
    const visibleOccurrences = occurrences.filter(e => typesInfo[e.eventType.id]?.isSelected)
    const visibleDurations   = durations.filter(e => typesInfo[e.eventType.id]?.isSelected)
    return visibleOccurrences.length + visibleDurations.length;
  }
}

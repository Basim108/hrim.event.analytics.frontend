import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {HrimEventModel} from 'src/app/shared/hrim-event.model';
import {DayModel} from "../../shared/day.model";
import {DateTime} from "luxon";
import {HrimEventService} from "../../services/hrim-event.service";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import {LogService} from "../../services/log.service";

@Component({
  selector: 'app-day-of-month',
  templateUrl: './day-of-month.component.html',
  styleUrls: ['./day-of-month.component.css']
})
export class DayOfMonthComponent implements OnInit, OnDestroy {
  @Input('day') dayModel!: DayModel;
  @Input() isLastWeek!: boolean;
  @Input() currentMonth!: DateTime;
  isOutOfMonth: boolean;
  isToday: boolean;

  @HostBinding('class.last-week') get lastWeek() {
    return this.isLastWeek
  }

  @HostBinding('class.out-of-month') get outOfMonth() {
    return this.isOutOfMonth
  }

  events: HrimEventModel[] = [];

  eventsSubscription: Subscription;

  constructor(private logger: LogService,
              private eventService: HrimEventService) {

  }

  ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const eventsOfTheDay$ = this.eventService.hrimEvents$.pipe(
      // tap(x => this.logger.debug(x.id + ' ' + x.date.toISODate())),
      filter(x => x.date.toISODate() == this.dayModel.dateTime.toISODate())
    );
    this.eventsSubscription = eventsOfTheDay$.subscribe(event => this.events.push(event));
    this.isToday = this.dayModel.dateTime.toISODate() === DateTime.now().toISODate();
    this.isOutOfMonth = this.dayModel.dateTime.month !== this.currentMonth.month || this.dayModel.dateTime.year !== this.currentMonth.year;
  }

  @HostListener("click") onClick() {
    this.onEventCreated()
  }

  onEventCreated() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    this.eventService.createEvent({
      id: '',
      name: 'new event',
      color: '#' + randomColor,
      date: this.dayModel.dateTime
    })
  }
}

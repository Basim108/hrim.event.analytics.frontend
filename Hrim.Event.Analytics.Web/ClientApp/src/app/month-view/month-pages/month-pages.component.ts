import {Component, Input, OnInit} from '@angular/core';
import {DateTime} from "luxon";
import {CalendarService} from "../../services/calendar.service";
import {Router} from "@angular/router";
import {RouteService} from "../../services/route.service";

@Component({
  selector: 'app-month-pages',
  templateUrl: './month-pages.component.html',
  styleUrls: ['./month-pages.component.css']
})
export class MonthPagesComponent implements OnInit {
  @Input() currentMonth!: DateTime;

  constructor(private calendarService: CalendarService,
              private router: Router,
              private routeService: RouteService) {
    console.debug('MonthPagesComponent constructor');
  }

  ngOnInit(): void {
    console.debug('MonthPagesComponent ngOnInit');
  }

  setCurrentMonth() {
    this.currentMonth = DateTime.now();
    this.routeService.navigateToMonthView(this.currentMonth);
  }

  setPrevMonth() {
    this.currentMonth = this.currentMonth.minus({month: 1});
    this.routeService.navigateToMonthView(this.currentMonth);
  }

  setNextMonth() {
    this.currentMonth = this.currentMonth.plus({month: 1});
    this.routeService.navigateToMonthView(this.currentMonth);
  }
}

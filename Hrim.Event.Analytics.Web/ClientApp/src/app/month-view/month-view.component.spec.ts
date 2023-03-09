import {ComponentFixture, TestBed} from '@angular/core/testing'

import {MonthViewComponent}      from './month-view.component'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {RouterTestingModule}     from '@angular/router/testing'
import {LogService}              from '../services/log.service'
import {RouteService}            from '../services/route.service'
import {CalendarService}         from '../services/calendar.service'
import {ActivatedRoute}          from '@angular/router'
import {MonthPagesComponent}     from './month-pages/month-pages.component'
import {DayOfMonthComponent}     from './day-of-month/day-of-month.component'
import {EventOfDayComponent}     from './day-of-month/event-of-day/event-of-day.component'
import {EventTypeListComponent}  from '../event-type-list/event-type-list.component'
import {EventTypeItemComponent}  from '../event-type-item/event-type-item.component'
import {MatIconModule}           from '@angular/material/icon'
import {MatButtonModule}         from '@angular/material/button'
import {MatDialogModule}         from '@angular/material/dialog'
import {MatInputModule}          from '@angular/material/input'
import {of}                      from 'rxjs'
import {DateTime}                from 'luxon'
import {MonthViewRouteModel}     from '../shared/month-view-route.model'

describe('MonthViewComponent', () => {
  let component: MonthViewComponent
  let fixture: ComponentFixture<MonthViewComponent>
  let monthRouteModel: MonthViewRouteModel
  let calendarService: CalendarService
  let monthDateTime: DateTime

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports:      [
                     HttpClientTestingModule,
                     RouterTestingModule.withRoutes([]),
                     MatIconModule,
                     MatButtonModule,
                     MatDialogModule,
                     MatInputModule
                   ],
                   declarations: [
                     MonthViewComponent,
                     MonthPagesComponent,
                     DayOfMonthComponent,
                     EventOfDayComponent,
                     EventTypeListComponent,
                     EventTypeItemComponent
                   ],
                   providers:    [CalendarService, LogService, RouteService]
                 })
                 .compileComponents()

    monthRouteModel = new MonthViewRouteModel()

    const routeService = TestBed.inject(RouteService)
    const currentRoute = TestBed.inject(ActivatedRoute)
    spyOn(currentRoute.snapshot.paramMap, 'get').and.returnValue('/month/2023-02')
    currentRoute.params = of({date: '/month/2023-02'})
    monthDateTime      = DateTime.fromFormat('2023-02', monthRouteModel.format)
    spyOn(routeService.monthView, 'getDateFromParams').and.returnValue(monthDateTime)
    calendarService = TestBed.inject(CalendarService)
    spyOn(calendarService, 'getWeeks')

    fixture                = TestBed.createComponent(MonthViewComponent)
    component              = fixture.componentInstance
    component.currentMonth = DateTime.fromFormat('2023-02', monthRouteModel.format)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should take date from route', () => {
    expect(calendarService.getWeeks).toHaveBeenCalledWith(monthDateTime)
  })
})

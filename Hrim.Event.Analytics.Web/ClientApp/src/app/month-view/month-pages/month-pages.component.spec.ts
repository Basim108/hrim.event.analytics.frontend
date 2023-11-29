import {ComponentFixture, TestBed} from '@angular/core/testing'

import {MonthPagesComponent} from './month-pages.component'
import {RouteService} from '../../services/route.service'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {RouterTestingModule} from '@angular/router/testing'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatDialogModule} from '@angular/material/dialog'
import {MatInputModule} from '@angular/material/input'
import {DateTime} from 'luxon'
import {NotificationService} from "../../services/notification.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('MonthPagesComponent', () => {
  let component: MonthPagesComponent
  let fixture: ComponentFixture<MonthPagesComponent>
  let routeService: RouteService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports:      [
                     HttpClientTestingModule,
                     RouterTestingModule.withRoutes([]),
                     MatIconModule,
                     MatButtonModule,
                     MatDialogModule,
                     MatInputModule,
                     NoopAnimationsModule,
                     MatSnackBarModule
                   ],
                   declarations: [MonthPagesComponent],
                   providers:    [RouteService, NotificationService]
                 })
                 .compileComponents()

    routeService = TestBed.inject(RouteService)
    fixture      = TestBed.createComponent(MonthPagesComponent)
    component    = fixture.componentInstance
    component.currentMonth = DateTime.fromFormat('2022-05', 'yyyy-MM')
    spyOn(routeService, 'navigateToMonthView')
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('setCurrentMonth should set current month and navigate', () => {
    component.setCurrentMonth()

    expect(routeService.navigateToMonthView).toHaveBeenCalled()
    const currentMonth = DateTime.now().toFormat('MM')
    expect(component.currentMonth.toFormat('MM')).toEqual(currentMonth)
  })

  it('setPrevMonth should set current month and navigate', () => {
    component.setPrevMonth()

    expect(routeService.navigateToMonthView).toHaveBeenCalled()
    expect(component.currentMonth.toFormat('MM')).toEqual('04')
  })

  it('setNextMonth should set current month and navigate', () => {
    component.setNextMonth()

    expect(routeService.navigateToMonthView).toHaveBeenCalled()
    expect(component.currentMonth.toFormat('MM')).toEqual('06')
  })
})

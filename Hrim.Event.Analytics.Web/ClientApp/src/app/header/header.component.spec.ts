import {ComponentFixture, TestBed} from '@angular/core/testing'

import {HeaderComponent} from './header.component'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {AuthMenuComponent} from '../auth-menu/auth-menu.component'
import {AuthService} from '../services/auth.service'
import {LogService} from '../services/log.service'
import {RouteService} from '../services/route.service'
import {RouterTestingModule} from '@angular/router/testing'
import {Router} from '@angular/router'
import {UserProfileModel} from '../shared/user-profile.model'
import {USERS} from '../../test_data/users'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let authService: AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports:      [
                     HttpClientTestingModule,
                     RouterTestingModule.withRoutes([])
                   ],
                   declarations: [HeaderComponent, AuthMenuComponent],
                   providers:    [AuthService, LogService, RouteService]
                 })
                 .compileComponents()
    authService = TestBed.inject(AuthService)
    fixture     = TestBed.createComponent(HeaderComponent)
    component   = fixture.componentInstance
    fixture.detectChanges()
  })

  it('being not authorized should hide year view', () => {
    const listItem = fixture.debugElement.nativeElement.querySelector('li.year-view-btn')
    expect(listItem).toBeNull()
  })

  it('being not authorized should hide month view', () => {
    const listItem = fixture.debugElement.nativeElement.querySelector('li.month-view-btn')
    expect(listItem).toBeNull()
  })

  it('being not authorized should hide day view', () => {
    const listItem = fixture.debugElement.nativeElement.querySelector('li.day-view-btn')
    expect(listItem).toBeNull()
  })

  it('being authorized should show year view', () => {
    authService.user$.next(USERS['john_doe'])
    fixture.detectChanges()
    const listItem = fixture.debugElement.nativeElement.querySelector('li.year-view-btn')
    expect(listItem).not.toBeNull()
  })

  it('being authorized should show month view', () => {
    authService.user$.next(USERS['john_doe'])
    fixture.detectChanges()
    const listItem = fixture.debugElement.nativeElement.querySelector('li.month-view-btn')
    expect(listItem).not.toBeNull()
  })

  it('being authorized should show day view', () => {
    authService.user$.next(USERS['john_doe'])
    fixture.detectChanges()
    const listItem = fixture.debugElement.nativeElement.querySelector('.day-view-btn')
    expect(listItem).not.toBeNull()
  })

  it('being on year view when clicked on month should navigate to month view', () => {
    const router       = TestBed.inject(Router)
    const routeService = TestBed.inject(RouteService)
    spyOn(routeService, 'navigateToLastSuccessfulMonth')
    spyOnProperty(router, 'url').and.returnValue('/year/2023')
    authService.user$.next(USERS['john_doe'])
    fixture.detectChanges()

    const anchor = fixture.debugElement.nativeElement.querySelector('li.month-view-btn > a')
    expect(anchor).not.toBeNull()
    anchor.click()

    expect(routeService.navigateToLastSuccessfulMonth).toHaveBeenCalledTimes(1)
  })

  it('being on month view when clicked on month should not navigate anywhere', () => {
    const router       = TestBed.inject(Router)
    const routeService = TestBed.inject(RouteService)
    spyOn(routeService, 'navigateToLastSuccessfulMonth')
    spyOnProperty(router, 'url').and.returnValue('/month/2023-02')
    authService.user$.next(USERS['john_doe'])
    fixture.detectChanges()

    const anchor = fixture.debugElement.nativeElement.querySelector('li.month-view-btn > a')
    expect(anchor).not.toBeNull()
    anchor.click()

    expect(routeService.navigateToLastSuccessfulMonth).toHaveBeenCalledTimes(0)
  })
})

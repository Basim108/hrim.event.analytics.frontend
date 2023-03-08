import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {RouteService}                from './route.service';
import {Location}                    from "@angular/common";
import {Router}                      from "@angular/router";
import {AppComponent}                from "../app.component";
import {appRoutes, AppRoutingModule} from "../app-routing.module";
import {RouterTestingModule}         from "@angular/router/testing";
import {MonthViewComponent}          from "../month-view/month-view.component";
import {YearViewComponent}           from "../year-view/year-view.component";
import {LandingViewComponent}        from "../landing-view/landing-view.component";
import {PageNotFoundComponent}       from "../pages/page-not-found/page-not-found.component";
import {DateTime}                    from "luxon";
import {AuthService}                 from "./auth.service";
import {HttpClientTestingModule}     from "@angular/common/http/testing";
import {TestUsers}                   from "../../test_data/users";

describe('RouteService', () => {
  let service: RouteService;
  let location: Location
  let router: Router
  let testUsers: TestUsers

  beforeEach(() => {
    testUsers = new TestUsers()
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(appRoutes)
      ],
      declarations: [
        AppComponent,
        MonthViewComponent,
        YearViewComponent,
        LandingViewComponent,
        PageNotFoundComponent
      ]
    })
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    router.initialNavigation()
    service = TestBed.inject(RouteService)
    const authService = TestBed.inject(AuthService)
    authService.user$.next({...testUsers.john_doe});
  });

  it('should be created', () => {
    expect(service).toBeTruthy()
  });

  it('navigateToLastSuccessfulMonth: by default navigate to current month', fakeAsync(() => {
    const expectedUrl = '/' + service.monthView.getRouteString(DateTime.now())
    service.navigateToLastSuccessfulMonth()
    tick()
    expect(location.path()).toBe(expectedUrl)
  }))

  it('navigateToLastSuccessfulMonth: given a specific month navigate to it', fakeAsync(() => {
    const expectedUrl = `/${service.monthView.path}/2014-12`
    service.monthView.lastSuccessfulDate = DateTime.fromFormat('2014-12-25', 'yyyy-MM-dd')
    service.navigateToLastSuccessfulMonth()
    tick()
    expect(location.path()).toBe(expectedUrl)
  }))
});

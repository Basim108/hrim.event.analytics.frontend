import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppRoutingModule, appRoutes } from "./app-routing.module";
import {MonthViewComponent} from "./month-view/month-view.component";
import {YearViewComponent} from "./year-view/year-view.component";
import {LandingViewComponent} from "./landing-view/landing-view.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {AppComponent} from "./app.component";
import {DateTime} from "luxon";
import {MonthViewRouteModel} from "./shared/month-view-route.model";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {YearViewRouteModel} from "./shared/year-view-route.model";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {LogService} from "./services/log.service";
import {NotificationService} from "./services/notification.service";

describe('Routing Module', () => {
  let location: Location
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        AppRoutingModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(appRoutes),
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
      declarations:[
        AppComponent,
        MonthViewComponent,
        YearViewComponent,
        LandingViewComponent,
        PageNotFoundComponent
      ],
      providers:[LogService, NotificationService]
    })
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    router.initialNavigation()
  })

  it('navigate to unknown page redirects you to /404', fakeAsync(() => {
    router.navigate(['hdfasjhfsadkf']);
    tick();
    expect(location.path()).toBe('/404');
  }));

  it('navigate to month view should be guarded with auth', fakeAsync(() => {
    const monthUrl = new MonthViewRouteModel().getRouteString(DateTime.now())
    router.navigate([monthUrl]);
    tick()
    expect(location.path()).toBe('/')
  }))

  it('navigate to year view should be guarded with auth', fakeAsync(() => {
    const yearUrl = new YearViewRouteModel().getRouteString(DateTime.now())
    router.navigate([yearUrl]);
    tick()
    expect(location.path()).toBe('/')
  }))
})

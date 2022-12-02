import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppRoutingModule, appRoutes } from "./app-routing.module";
import {MonthViewComponent} from "./month-view/month-view.component";
import {YearViewComponent} from "./year-view/year-view.component";
import {LandingViewComponent} from "./landing-view/landing-view.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {AppComponent} from "./app.component";

describe('Routing Module', () => {
  let location: Location
  let router: Router
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        AppRoutingModule,
        RouterTestingModule.withRoutes(appRoutes)
      ],
      declarations:[
        AppComponent,
        MonthViewComponent,
        YearViewComponent,
        LandingViewComponent,
        PageNotFoundComponent
      ]
    })
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    fixture = TestBed.createComponent(AppComponent)
    router.initialNavigation()
  })

  it('navigate to unknown page redirects you to /404', fakeAsync(() => {
    router.navigate(['hdfasjhfsadkf']);
    tick();
    expect(location.path()).toBe('/404');
  }));
})

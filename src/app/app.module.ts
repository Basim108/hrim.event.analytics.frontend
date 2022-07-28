import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {YearViewComponent} from './year-view/year-view.component';
import {MonthViewComponent} from './month-view/month-view.component';
import {DayOfMonthComponent} from './month-view/day-of-month/day-of-month.component';
import {EventOfDayComponent} from './month-view/day-of-month/event-of-day/event-of-day.component';
import {MonthPagesComponent} from './month-view/month-pages/month-pages.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule, Routes} from "@angular/router";
import {DateTime} from "luxon";
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import {MonthViewRouteModel} from "./shared/month-view-route.model";
import {YearViewRouteModel} from "./shared/year-view-route.model";

const monthView = new MonthViewRouteModel();
const yearView = new YearViewRouteModel();

const appRoutes: Routes = [
  { path: yearView.configPath, component: YearViewComponent },
  { path: monthView.configPath, component: MonthViewComponent },
  { path: '', redirectTo: monthView.getRouteString(DateTime.now()), pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
console.debug('route configs: ', appRoutes);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    YearViewComponent,
    MonthViewComponent,
    DayOfMonthComponent,
    EventOfDayComponent,
    MonthPagesComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

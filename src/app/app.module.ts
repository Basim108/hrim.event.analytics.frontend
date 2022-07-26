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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    YearViewComponent,
    MonthViewComponent,
    DayOfMonthComponent,
    EventOfDayComponent,
    MonthPagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

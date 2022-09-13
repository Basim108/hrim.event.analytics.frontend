import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS} from '@angular-material-components/color-picker'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLuxonDateModule} from "@angular/material-luxon-adapter";

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {YearViewComponent} from './year-view/year-view.component';
import {MonthViewComponent} from './month-view/month-view.component';
import {DayOfMonthComponent} from './month-view/day-of-month/day-of-month.component';
import {MonthPagesComponent} from './month-view/month-pages/month-pages.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {AuthMenuComponent} from './auth-menu/auth-menu.component';
import {LandingViewComponent} from './landing-view/landing-view.component';
import {EventTypeListComponent} from './event-type-list/event-type-list.component';
import {EventTypeItemComponent} from './event-type-item/event-type-item.component';
import {EventOfDayComponent} from "./event-of-day/event-of-day.component";

import {EventTypeDetailsDialog} from './event-type-details-dialog/event-type-details-dialog.component';
import {EventOccurrenceDetailsDialog} from './event-occurrence-details-dialog/event-occurrence-details-dialog.component';
import {EventDurationDetailsDialog} from './event-duration-details-dialog/event-duration-details-dialog.component';

import {ApiResponseInterceptor} from "./services/api-response-interceptor.service";
import {MatMenuModule} from "@angular/material/menu";


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
    PageNotFoundComponent,
    AuthMenuComponent,
    LandingViewComponent,
    EventTypeListComponent,
    EventTypeItemComponent,
    EventTypeDetailsDialog,
    EventOccurrenceDetailsDialog,
    EventDurationDetailsDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    FormsModule,
    MatMenuModule
  ],
  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
    {provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

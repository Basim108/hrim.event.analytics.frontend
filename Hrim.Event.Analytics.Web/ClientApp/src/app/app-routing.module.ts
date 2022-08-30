import {MonthViewRouteModel} from "./shared/month-view-route.model";
import {YearViewRouteModel} from "./shared/year-view-route.model";
import {RouterModule, Routes} from "@angular/router";
import {YearViewComponent} from "./year-view/year-view.component";
import {MonthViewComponent} from "./month-view/month-view.component";
import {DateTime} from "luxon";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {NgModule} from "@angular/core";

const monthView = new MonthViewRouteModel();
const yearView = new YearViewRouteModel();

const appRoutes: Routes = [
  {path: yearView.configPath, component: YearViewComponent},
  {path: monthView.configPath, component: MonthViewComponent},
  {path: '', redirectTo: monthView.getRouteString(DateTime.now()), pathMatch: 'full'},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

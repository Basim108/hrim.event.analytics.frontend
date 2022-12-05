import {MonthViewRouteModel} from "./shared/month-view-route.model";
import {YearViewRouteModel} from "./shared/year-view-route.model";
import {RouterModule, Routes} from "@angular/router";
import {YearViewComponent} from "./year-view/year-view.component";
import {MonthViewComponent} from "./month-view/month-view.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {NgModule} from "@angular/core";
import {LandingViewComponent} from "./landing-view/landing-view.component";
import {AuthGuard} from "./services/auth-guard.service";

const monthView = new MonthViewRouteModel();
const yearView = new YearViewRouteModel();

export const appRoutes: Routes = [
  {path: yearView.configPath, canActivate: [AuthGuard], component: YearViewComponent},
  {path: monthView.configPath, canActivate: [AuthGuard], component: MonthViewComponent},
  {path: '', component: LandingViewComponent},
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

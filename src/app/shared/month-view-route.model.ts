import {DateViewRouteModel} from "./date-view-route.model";

export class MonthViewRouteModel extends DateViewRouteModel {
  constructor() {
    super('month', 'yyyy-MM');
  }
}

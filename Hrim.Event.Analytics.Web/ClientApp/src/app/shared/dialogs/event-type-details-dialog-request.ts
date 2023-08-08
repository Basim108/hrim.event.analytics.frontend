import {UserEventType}            from "../event-type.model";
import {BaseDetailsDialogRequest} from "./base-details-dialog-request";

export class EventTypeDetailsDialogRequest extends BaseDetailsDialogRequest {

  constructor(public model: UserEventType, isEdit: boolean = false) {
    const title = isEdit
                  ? 'Edit event type'
                  : 'Create a new type of events';
    super(title, isEdit)
  }
}

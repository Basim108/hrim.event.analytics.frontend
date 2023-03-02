import {SomeEventModel}           from "../some-event.model";
import {OccurrenceEventModel}     from "../occurrence-event.model";
import {BaseDetailsDialogRequest} from "./base-details-dialog-request";

export class EventDetailsDialogRequest extends BaseDetailsDialogRequest {
  constructor(public model: SomeEventModel, isEdit: boolean = false) {
    const typeName = model instanceof OccurrenceEventModel
                     ? 'occurrence'
                     : 'duration'
    const title    = isEdit
                     ? `Edit an ${typeName} event`
                     : `Create a new ${typeName} of events`;
    super(title, isEdit)
  }
}

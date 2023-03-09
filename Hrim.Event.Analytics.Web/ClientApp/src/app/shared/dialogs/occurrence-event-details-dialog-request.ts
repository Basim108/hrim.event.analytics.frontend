import {OccurrenceEventModel}     from "../occurrence-event.model";
import {BaseDetailsDialogRequest} from "./base-details-dialog-request";
import {EventSaveContext}         from "../../dialogs/base-event-details-dialog";

export class OccurrenceEventDetailsDialogRequest extends BaseDetailsDialogRequest {
  constructor(public model: OccurrenceEventModel, isEdit: boolean = false) {
    const title = isEdit
                  ? 'Edit an occurrence event'
                  : 'Create a new occurrence of events'
    super(title, isEdit)
  }
}

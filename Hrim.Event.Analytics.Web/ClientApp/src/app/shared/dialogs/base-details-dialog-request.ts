export class BaseDetailsDialogRequest {
  action: string

  constructor(public title: string, isEdit: boolean = false) {
    this.action = isEdit ? 'Save' : 'Create';
  }
}

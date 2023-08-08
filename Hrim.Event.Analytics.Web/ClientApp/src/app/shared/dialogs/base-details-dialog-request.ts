export class BaseDetailsDialogRequest {
  action: string

  constructor(public title: string, public isEdit: boolean = false) {
    this.action = isEdit ? 'Save' : 'Create';
  }
}

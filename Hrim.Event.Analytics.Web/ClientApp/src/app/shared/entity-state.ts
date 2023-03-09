export class EntityState<T> {
  isCreated: boolean = false
  isDeleted: boolean = false
  isModified: boolean = false
  isUnsaved: boolean = false
  isSelected: boolean = false

  entity: T
}

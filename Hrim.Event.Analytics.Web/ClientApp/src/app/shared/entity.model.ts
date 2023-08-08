export abstract class EntityModel {
  id: string
  concurrentToken: number

  protected constructor(id: string, concurrentToken: number) {
    this.id              = id
    this.concurrentToken = concurrentToken
  }
}

export class UserEventType {
  id: string
  name: string = ''
  description: string | null = ''
  color: string = ''
  is_deleted: boolean
  is_mine: boolean
  concurrent_token: number
}

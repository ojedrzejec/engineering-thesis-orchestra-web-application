export type TGroup = {
  id: string
  name: string
  members: {
    id: string
    email: string
    firstName: string
    lastName: string
    instruments: string
  }[]
  value: string
}

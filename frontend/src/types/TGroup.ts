export type TGroup = {
  id: string | undefined
  name: string | null
  members: {
    id: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    instruments: string | null
  }[]
  value: string | undefined
}

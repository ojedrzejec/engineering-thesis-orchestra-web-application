import type { TInstrument } from '@/types/TInstrument'

export type TOrchestraMember = {
  firstName: string | null
  lastName: string | null
  instruments: TInstrument[] | []
  phone: string
  dateOfBirth: Date | null
  isStudent: boolean | null
  university: string | null
  profilePicture: string | null
  description: string | null
}

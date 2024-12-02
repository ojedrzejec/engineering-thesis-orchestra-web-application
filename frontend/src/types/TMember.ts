import type { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import type { TInstrument } from '@/types/TInstrument'

export type TMember = {
  id: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  instruments: string | null
  phone: string | null
  dateOfBirth: Date | null
  isStudent: boolean | null
  university: string | null
  profilePicture: string | null
  description: string | null
  accessType: EOrchestraRole | null
}

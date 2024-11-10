import type { TOrchestraMember } from '../types/TOrchestraMember';

export const initOrchestraMember: TOrchestraMember = {
    password: null,
    email: null,
    firstName: null,
    lastName: null,
    phone: '',
    dateOfBirth: new Date(),
    isStudent: null,
    university: null,
    profilePicture: '',
    description: null,
}

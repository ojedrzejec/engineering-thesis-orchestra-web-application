import type { TOrchestraMember } from '../types/TOrchestraMember';

export const initOrchestraMember: TOrchestraMember = {
    firstName: null,
    lastName: null,
    phone: '',
    dateOfBirth: new Date(),
    isStudent: null,
    university: null,
    profilePicture: '',
    description: null,
    
    instrument: '',
    
    is_owner: false,
    is_manager: false,
}

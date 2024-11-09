import type { TOrchestraMember } from '../types/TOrchestraMember';

export const initOrchestraMember: TOrchestraMember = {
    firstName: null,
    lastName: null,
    phone: '',
    dateOfBirth: new Date(),
    isStudent: false,
    university: '',
    profilePicture: '',
    description: '',
    
    instrument: '',
    
    is_owner: false,
    is_manager: false,
}

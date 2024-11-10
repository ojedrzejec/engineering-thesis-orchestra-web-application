export type TOrchestraMember = {
    firstName: string | null;
    lastName: string | null;
    phone: string;
    dateOfBirth: Date;
    isStudent: boolean | null;
    university: string;
    profilePicture: string;
    description: string;
    
    instrument: string;
    
    is_owner: boolean;
    is_manager: boolean;
}
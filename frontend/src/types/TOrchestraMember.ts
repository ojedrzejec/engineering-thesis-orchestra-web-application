export type TOrchestraMember = {
    firstName: string | null;
    lastName: string | null;
    phone: string;
    dateOfBirth: Date;
    isStudent: boolean | null;
    university: string | null;
    profilePicture: string;
    description: string | null;
    
    instrument: string;
    
    is_owner: boolean;
    is_manager: boolean;
}
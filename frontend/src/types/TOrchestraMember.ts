export type TOrchestraMember = {
    password: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string;
    dateOfBirth: Date;
    isStudent: boolean | null;
    university: string | null;
    profilePicture: string;
    description: string | null;
}
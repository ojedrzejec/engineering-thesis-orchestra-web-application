import { EOrchestraRole } from '@/constants/enums/EOrchestraRole';

export type TOrchestraAccess = {
    id: string;
    name: string;
    accessType: EOrchestraRole;
}

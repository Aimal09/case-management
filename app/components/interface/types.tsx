export type Cases = {
    id?: string;
    code?: string;
    title?: string;
    caseType?: string;
    status?: string;
    taluka?: string;
    deh?: string;
    dateOfInstitution?: string;
    nextDate?: string;
    location?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;

    mukhtiarkarACReportUploaded?: boolean;
    evacueePropertyReportUploaded?: boolean;
    barrageBranchReportUploaded?: boolean;
    newspaperPublicationUploaded?: boolean;

    mukhtiarkarACReportPath?: string;
    evacueePropertyReportPath?: string;
    barrageBranchReportPath?: string;
    newspaperPublicationPath?: string;

    forwardedToMukhtiarkarId?: String;
    forwardedByName?: String;
    forwardedToMukhtiarkar?: {
        id?: string;
        name?: string;
        role?: string;
    }
    
    //involvedOfficers?: Officers[];
    //involvedPersons?: Persons[];
    userCases?: Array<{
        assignedToUser?: {
          id: string;
          name: string;
          role: string;
        }
      }>;
    evidences?: Evidences[];
    notes?: Notes[];
  };

export type Evidences = {
    id?: string;
    code?: string;
    type?: string;
    description?: string;
    dateCollected?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type Notes = {
    id?: string;
    code?: string;
    title?: string;
    content?: string;
    noteAddedOn?: string;
};

export interface DashboardStats {
    label: string;
    value: number;
    color: string;
};
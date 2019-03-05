
export class profileData {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    position: string;
    country: string;
}

export class CaseData {
    Id;
    UserId;
    CaseInputString: string;
    CaseInputJson;
    CaseName;
    CaseDescription;
    CaseDate;

    constructor(id, userId, caseInputString, caseName, caseDescription, caseDate) {
        this.Id = id;
        this.UserId = userId;
        this.CaseInputString = caseInputString;
        this.CaseName = caseName;
        this.CaseDescription = caseDescription;
        this.CaseDate = caseDate;
    }


}
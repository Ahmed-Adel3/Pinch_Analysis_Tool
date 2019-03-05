class IStream {
    Name: String;
    Supply: number;
    Target: number;
    Duty: number;

    constructor() {
    }
}

// tslint:disable-next-line:class-name
export class hotStream extends IStream { }

// tslint:disable-next-line:class-name
export class coldStream extends IStream { }

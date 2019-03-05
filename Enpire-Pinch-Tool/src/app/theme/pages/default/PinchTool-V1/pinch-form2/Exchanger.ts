export class Exchanger {
    name: string;
    hotSupply: number;
    hotTarget: number;
    coldSupply: number;
    coldTarget: number;
    duty: number;
    utilityType: number;
    constructor(n, hs, ht, cs, ct, d, u) {
        this.name = n;
        this.hotSupply = ht;
        this.hotTarget = ht;
        this.coldSupply = cs;
        this.coldTarget = ct;
        this.duty = d;
        this.utilityType = u;
    }
}


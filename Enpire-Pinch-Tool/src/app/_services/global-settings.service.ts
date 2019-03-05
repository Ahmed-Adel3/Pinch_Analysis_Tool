import { Injectable } from '@angular/core';

@Injectable()
export class GlobalSettingsService {

    constructor() { }
    local: boolean = false ;
    front: boolean = false;

    buildStatus() {

        if (this.local === true) {
            return 'http://localhost:59388/'
        }
        else return 'http://pinchapi.gaptech.co/'
    }

    frontStatus() {
        if (this.local === true) {
            return 'http://localhost:4200/'
        }
        else return 'http://pinch.gaptech.co/'
    }

}

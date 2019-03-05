import { Injectable } from '@angular/core';
import { PinchFormV1TestService } from '../../../theme/pages/default/PinchTool-V1/pinch-form/pinch-formV1-test.service'
import { PinchForm2V1TestService } from '../../../theme/pages/default/PinchTool-V1/pinch-form2/pinch-form2V1-test.service.ts'
import { Router } from '@angular/router';

@Injectable()
export class SamplesService {

    //@Output() invokeEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor(private ser1V1: PinchFormV1TestService,
        private ser2V1: PinchForm2V1TestService,
        private router: Router
    ) { }

    V1Sample1() {
        this.ser1V1.TestData1()
    }
    V1Sample2() {
        this.ser1V1.TestData2()
    }
    V1Sample3() {
        this.ser2V1.TestData3()
    }
    V1Sample4() {
        this.ser1V1.TestData4()
    }
}



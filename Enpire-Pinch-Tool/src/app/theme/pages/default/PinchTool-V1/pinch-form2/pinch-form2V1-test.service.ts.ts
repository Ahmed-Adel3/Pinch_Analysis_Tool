import { Injectable } from '@angular/core';
import { PinchCalculation2Service } from './pinch-calculation2.service';
import { GetSolutionService } from '../solution/get-solution.service';
import { Router } from '@angular/router';

@Injectable()
export class PinchForm2V1TestService {

    constructor(private _PC: PinchCalculation2Service,
        private SolutionService: GetSolutionService,
        private router: Router) { }

    body3 = {
        "CaseName": "Test Case 3",
        "CaseDescription": "This is a Test Case ",
        "Approach": 10,
        "DutyType": 0,
        "Units": 0,
        "Exchangers": [
            {
                "Name": "HE 1",
                "hotGroup": {
                    "hotSupply": 183.3,
                    "hotTarget": 130
                },
                "coldGroup": {
                    "coldSupply": 120,
                    "coldTarget": 160
                },
                "Duty": 16000000,
                "exchangerType": 0,
                "Utility": ""
            },
            {
                "Name": "HE 2",
                "hotGroup": {
                    "hotSupply": 180,
                    "hotTarget": 130
                },
                "coldGroup": {
                    "coldSupply": 120,
                    "coldTarget": 157.5
                },
                "Duty": 22500000,
                "exchangerType": 0,
                "Utility": ""
            },
            {
                "Name": "HE 3",
                "hotGroup": {
                    "hotSupply": 280,
                    "hotTarget": 183.3
                },
                "coldGroup": {
                    "coldSupply": 157.5,
                    "coldTarget": 208.8
                },
                "Duty": 29000000,
                "exchangerType": 0,
                "Utility": ""
            },
            {
                "Name": "HE 4",
                "hotGroup": {
                    "hotSupply": 130,
                    "hotTarget": 41.11
                },
                "coldGroup": {
                    "coldSupply": 20,
                    "coldTarget": 120
                },
                "Duty": 40000000,
                "exchangerType": 0,
                "Utility": ""
            },
            {
                "Name": "Heater 1",
                "coldGroup": {
                    "coldSupply": 208.8,
                    "coldTarget": 260
                },
                "Duty": 32500000,
                "exchangerType": 1,
                "Utility": ""
            },
            {
                "Name": "Cooler 1",
                "hotGroup": {
                    "hotSupply": 130,
                    "hotTarget": 60
                },
                "Duty": 9500000,
                "exchangerType": 2,
                "Utility": ""
            },
            {
                "Name": "Cooler 2",
                "hotGroup": {
                    "hotSupply": 41.11,
                    "hotTarget": 20
                },
                "Duty": 21000000,
                "exchangerType": 2,
                "Utility": ""
            }
        ],
        "Utilities":{
        "HotUtilities": [],
        "ColdUtilities": []},
        "optimize":false,
        "LifeTime":175200,
        "DollarPerUA":500000000
    }

    TestData3() {
        let service = this._PC.postData(this.body3, this.body3.DutyType, this.body3.Exchangers, this.body3.Utilities);
        
        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
            this.SolutionService.response = res;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }
}

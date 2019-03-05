import { Component, OnInit } from '@angular/core';
import { CaseData } from '../profile/classes';
import { GetLandingPageDataService } from './get-landing-page-data.service';
import { Router } from '@angular/router';
import { LoadCaseService as LoadCaseService1 } from '../PinchTool-V1/pinch-form/load-case.service'
import { LoadCaseService as LoadCaseService2 } from '../PinchTool-V1/pinch-form2/load-case.service'
import { PinchFormV1TestService } from '../PinchTool-V1/pinch-form/pinch-formV1-test.service';
import { PinchForm2V1TestService } from '../PinchTool-V1/pinch-form2/pinch-form2V1-test.service.ts';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

    constructor(private _lpData: GetLandingPageDataService,
        private lc1: LoadCaseService1,
        private lc2: LoadCaseService2,
        private router: Router,
        private ser1V1: PinchFormV1TestService,
        private ser2V1: PinchForm2V1TestService, ) { }

    casesData;

    ngOnInit() {
        this.autoType(".type-js", 50);
        this.getcases();
    }

    autoType(elementClass, typingSpeed) {
        var thhis = $(elementClass);
        thhis.css({
            "position": "relative",
            "display": "inline-block"
        });
        thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
        thhis = thhis.find(".text-js");
        var text = thhis.text().trim().split('');
        var amntOfChars = text.length;
        var newString = "";
        thhis.text("|");
        setTimeout(function() {
            thhis.css("opacity", 1);
            thhis.prev().removeAttr("style");
            thhis.text("");
            for (var i = 0; i < amntOfChars; i++) {
                (function(i, char) {
                    setTimeout(function() {
                        newString += char;
                        thhis.text(newString);
                    }, i * typingSpeed);
                })(i + 1, text[i]);
            }
        }, 1500);
    }

    getcases() {
        this._lpData.getCases().subscribe(
            data => {
                this.casesData = data.map(a => { return new CaseData(a.id, a.userId, a.caseInput, a.caseName, a.caseDescription, a.caseDate) });
            }, error => { console.log(error) })
    }

    loadCase(id) {
        let jsonCase = JSON.parse(this.casesData.filter(a => a.Id === id)[0].CaseInputString)

        if (jsonCase.hotStreams !== undefined) {
            this.lc1.case = jsonCase;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byStream' }]);
        } else {
            this.lc2.case = jsonCase;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byExchanger' }]);
        }
    }

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

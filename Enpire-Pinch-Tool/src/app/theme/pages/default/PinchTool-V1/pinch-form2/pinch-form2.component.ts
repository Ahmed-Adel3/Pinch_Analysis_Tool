import { Component, OnInit, ViewChild } from '@angular/core';
import { PinchCalculation2Service } from './pinch-calculation2.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Exchanger } from './Exchanger';
import { comparisonValidator} from '../comparison-validator';
import { GetSolutionService } from '../solution/get-solution.service';
import { Router } from '@angular/router';
import { GlobalSettingsService } from '../../../../../_services/global-settings.service';
import * as XLSX from 'xlsx';
import { LoadCaseService } from './load-case.service';
import { MatHorizontalStepper } from '@angular/material';
import DefaultUtilities from '../DefaultUtilities'


type AOA = any[][];


@Component({
    selector: 'app-pinch-form2',
    templateUrl: './pinch-form2.component.html',
    styleUrls: ['./pinch-form2.component.css']
})

export class PinchForm2Component implements OnInit {

    @ViewChild('stepper') stepper: MatHorizontalStepper;
    
    BasicInfoForm: FormGroup;
    UtilitiesForm: FormGroup;
    FormG2: FormGroup;            
    FormUpload: FormGroup;       // for excel sheet upload 

    // variables to save forms data
    BasicInfoFormData = null;
    UtilitiesFormData = null;
    FormG2Data = null;

    // variables to save FormArrays
    HotUtilities;
    ColdUtilities;
    HotUtilitiesNames;
    ColdUtilitiesNames;
    UselessUtilities = [];
    Exchangers;

    //
    Units = [
        { label: 'Metric System (°C | MM Kcal/hr )', value: 0 },
        { label: 'Field Units (°F | MM BTU/hr)',     value: 1 }];

    utilityTypeOptions = [
        { label: '(choose one)', value: '' },
        { label: 'Heat Exchanger', value: 0 },
        { label: 'Heater', value: 1 },
        { label: 'Cooler', value: 2 }];

    UtilititesStageSelect = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }];


    // Variables to detect moving from one field to another to save in local storage
    iStream;
    iType = '';
    iHot: number;
    iCold: number;
    streamChanged: boolean = false;
    localStorageData = {  BasicInfo: false, Utilities: false, Exchangers: false };

    // upload Excel filoe variables
    data: AOA = [];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    prototype:any= {ColdUtilities:[],HotUtilities:[]}


    constructor(private fb: FormBuilder,
        private _PC: PinchCalculation2Service,
        private SolutionService: GetSolutionService,
        private router: Router,
        private _gc: GlobalSettingsService,
        private lc2: LoadCaseService) { }


    ngOnInit() {
        this.InitializaForms('BasicInfo')
        this.InitializaForms('Utilities')
        this.InitializaForms('Exchangers')
        this.InitializaForms('Excel')
        this.CheckFillingFormsSource()
    }

    CheckFillingFormsSource() {

        if (localStorage.getItem('F2EX') !== null) { this.localStorageData.Exchangers = true }
        if (localStorage.getItem('F2HU') !== null || localStorage.getItem('F2CU') !== null) { this.localStorageData.Utilities = true }
        if (localStorage.getItem('F2AT') !== null || localStorage.getItem('F2CN') !== null || localStorage.getItem('F2CD') !== null) { this.localStorageData.BasicInfo = true }


        if (this.lc2.case !== undefined) {
            this.loadData();
        }
        else {
            if (this.localStorageData.BasicInfo === true) {
                this.addDataFromStorage('BasicInfo')
            }

            if (this.localStorageData.Utilities === true) {
                this.addDataFromStorage('Utilities')
            } else {this.addDefaultUtilities()}

            if (this.localStorageData.Exchangers === true) {
                this.addDataFromStorage('Exchangers')
            } else {
                this.addExchanger();
                this.addExchanger();
            }
        }
    }

    InitializaForms(type: string) {
        switch (type) {
            case 'BasicInfo':
                this.BasicInfoForm = this.fb.group({
                    CaseName: [null, Validators.required],
                    CaseDescription: [null],
                    Approach: [null, [Validators.required, Validators.min(1)]],
                    Units: [0],
                    UtilitiesStage: ['No']
                });
                break;

            case 'Utilities':
                this.UtilitiesForm = this.fb.group({
                    HotUtilities: this.fb.array([]),
                    ColdUtilities: this.fb.array([]),
                })
                break;

            case 'Exchangers':
                this.FormG2 = this.fb.group({
                    Exchangers: this.fb.array([]),
                });
                break;

            case 'Excel':
                this.FormUpload = this.fb.group({
                    file: [null, Validators.required]
                });
                break;
        }
    }

    addDataFromStorage(form: string) {

        switch (form) {
            case 'BasicInfo':
                let AT = JSON.parse(localStorage.getItem('F2AT'));
                let CN = JSON.parse(localStorage.getItem('F2CN'));
                let CD = JSON.parse(localStorage.getItem('F2CD'));

                this.fillFormWithData('', '', '', AT, CN, CD)
                break;

            case 'Utilities':
                let HU = JSON.parse(localStorage.getItem('F2HU'));
                let CU = JSON.parse(localStorage.getItem('F2CU'));
                this.fillFormWithData('', HU, CU, '', '', '')
                break;

            case 'Exchangers':
                let EX = JSON.parse(localStorage.getItem('F2EX'));
                this.fillFormWithData(EX, '', '', '', '', '')
                break;
        }
    }

    loadData() {

        let EX = this.lc2.case.Exchangers.map(a => {
            if (a.hotGroup == undefined) {
                const obj = {
                    Name: a.Name,
                    coldGroup: { coldSupply: a.coldGroup.coldSupply, coldTarget: a.coldGroup.coldTarget },
                    Type: a.exchangerType,
                    Duty: a.Duty / 1000000,
                    UtilityMatch: a.UtilityMatch
                }; return obj
            }
            else if (a.coldGroup == undefined) {
                const obj = {
                    Name: a.Name,
                    hotGroup: { hotSupply: a.hotGroup.hotSupply, hotTarget: a.hotGroup.hotTarget },
                    Type: a.exchangerType,
                    Duty: a.Duty / 1000000,
                    UtilityMatch: a.UtilityMatch
                }; return obj
            }
            else {
                const obj = {
                    Name: a.Name,
                    hotGroup: { hotSupply: a.hotGroup.hotSupply, hotTarget: a.hotGroup.hotTarget },
                    coldGroup: { coldSupply: a.coldGroup.coldSupply, coldTarget: a.coldGroup.coldTarget },
                    Type: a.exchangerType,
                    Duty: a.Duty / 1000000,
                    UtilityMatch: a.UtilityMatch
                }; return obj
            }
        }
        );
        let HU = this.lc2.case.hotUtilityStreams;
        let CU = this.lc2.case.coldUtilityStreams;
        let AT = this.lc2.case.Approach;
        let CN = this.lc2.case.CaseName;
        let CD = this.lc2.case.CaseDescription;

        if(HU.length !== 0 || CU.length !== 0) {
            this.BasicInfoForm.get('UtilitiesStage').setValue('Yes')
        } else {
            this.BasicInfoForm.get('UtilitiesStage').setValue('No')        
        }

        this.fillFormWithData(EX, HU, CU, AT, CN, CD)
    }

    fillFormWithData(EX, HU, CU, AT, CN, CD) {

        if (AT !== '' || CN !== '' || CD !== '') {
            this.BasicInfoForm.get('CaseName').setValue(CN);
            this.BasicInfoForm.get('CaseDescription').setValue(CD);
            this.BasicInfoForm.get('Approach').setValue(AT);
            this.markFormGroupTouched(this.BasicInfoForm)
        }

        if (HU !== '' || CU !== '') {
            this.HotUtilities = this.UtilitiesForm.get('HotUtilities') as FormArray;
            this.ColdUtilities = this.UtilitiesForm.get('ColdUtilities') as FormArray;

            if (HU !== null) {
                for (let i = 0; i < HU.length; i++) {
                    let gp = this.fb.group(
                        {
                            Name: new FormControl(HU[i].Name, { validators: [Validators.required], updateOn: 'change' }),
                            Supply: new FormControl(HU[i].Supply, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Target: new FormControl(HU[i].Target, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            UtilityApproach: new FormControl(HU[i].UtilityApproach, { validators: [Validators.required, Validators.min(1), Validators.max(100)], updateOn: 'change' }),
                        },
                        { validator: comparisonValidator('Supply', 'Target'), updateOn: 'change' },
                    );
                    this.HotUtilities.push(gp);
                }
            }

            if (CU !== null) {
                for (let i = 0; i < CU.length; i++) {
                    let gp = this.fb.group(
                        {
                            Name: new FormControl(CU[i].Name, { validators: [Validators.required], updateOn: 'change' }),
                            Supply: new FormControl(CU[i].Supply, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Target: new FormControl(CU[i].Target, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            UtilityApproach: new FormControl(CU[i].UtilityApproach, { validators: [Validators.required, Validators.min(1), Validators.max(100)], updateOn: 'change' }),
                        },
                        { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' },
                    );
                    this.ColdUtilities.push(gp);
                }
            }
            this.markFormGroupTouched(this.UtilitiesForm)
        }

        if (EX !== '') {
            this.Exchangers = this.FormG2.get('Exchangers') as FormArray;

            for (let i = 0; i < EX.length; i++) {
                let gp = this.fb.group({
                    Type: new FormControl(EX[i].Type, Validators.required),
                    Name: new FormControl(EX[i].Name, Validators.required),
                    Duty: new FormControl(EX[i].Duty, [Validators.required, Validators.min(0), Validators.max(9999)]),
                    UtilityMatch: new FormControl(EX[i].UtilityMatch, { updateOn: 'change' }),
                });


                let hSupp = (EX[i].hotGroup !== undefined) ? EX[i].hotGroup.hotSupply : '';
                let hTar = (EX[i].hotGroup !== undefined) ? EX[i].hotGroup.hotTarget : '';
                let cSupp = (EX[i].coldGroup !== undefined) ? EX[i].coldGroup.coldSupply : '';
                let cTar = (EX[i].coldGroup !== undefined) ? EX[i].coldGroup.coldTarget : '';

                gp.addControl('hotGroup', this.fb.group({
                    hotSupply: new FormControl(hSupp, [Validators.required, Validators.min(-273), Validators.max(10000)]),
                    hotTarget: new FormControl(hTar, [Validators.required, Validators.min(-273), Validators.max(10000)])
                }, { validator: comparisonValidator('hotSupply', 'hotTarget') }));
                
                gp.addControl('coldGroup', this.fb.group({
                    coldSupply: new FormControl(cSupp, [Validators.required, Validators.min(-273), Validators.max(10000)]),
                    coldTarget: new FormControl(cTar, [Validators.required, Validators.min(-273), Validators.max(10000)])
                }, { validator: comparisonValidator('coldTarget', 'coldSupply') }));
                this.Exchangers.push(gp);

                let thisType = gp.controls['Type'].value;
                if (thisType === "1" || thisType === 1) this.FormG2.get(['Exchangers', i, 'hotGroup']).disable();
                else if (thisType === "2" || thisType === 2) this.FormG2.get(['Exchangers', i, 'coldGroup']).disable();
            }

            switch (EX.length) {
                case 0: this.addExchanger(); this.addExchanger(); break;
                case 1: this.addExchanger(); break;
            }
            this.markFormGroupTouched(this.FormG2)
        }
    }

    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control.controls !== undefined) { this.markFormGroupTouched(control) }
        });
    }

    checkDuplicates(array, string) {
        if (array.indexOf(string) !== array.lastIndexOf(string)) {
            return true;
        }
        else return false;
    }

    createItem(): FormGroup {
        let InitialUtilityMatch = '';
        if(this.BasicInfoForm.get('UtilitiesStage').value === 'Yes') {
            InitialUtilityMatch = this.BasicInfoForm.get('UtilitiesStage').value[0];
        }
        return this.fb.group({
            Type: new FormControl('', Validators.required),
            Name: new FormControl('', Validators.required),
            hotGroup: this.fb.group({
                hotSupply: new FormControl('', [Validators.required, Validators.min(-273), Validators.max(10000)]),
                hotTarget: new FormControl('', [Validators.required, Validators.min(-273), Validators.max(10000)])
            },
                { validator: comparisonValidator('hotSupply', 'hotTarget') }),
            coldGroup: this.fb.group({
                coldSupply: new FormControl('', [Validators.required, Validators.min(-273), Validators.max(10000)]),
                coldTarget: new FormControl('', [Validators.required, Validators.min(-273), Validators.max(10000)])
            },
                { validator: comparisonValidator('coldTarget', 'coldSupply') }),
            Duty: new FormControl('', [Validators.required, Validators.min(0), Validators.max(9999)]),
            UtilityMatch: new FormControl({ updateOn: 'change' }),
        }
        );
    }

    createUtility(type: string): FormGroup {
        if (type === 'hot') {
            let gp = this.fb.group(
                {
                    Name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                    Supply: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                    Target: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                    UtilityApproach: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)], updateOn: 'change' }),
                    Cost: new FormControl(0)  
                },
                { validator: comparisonValidator('Supply', 'Target'), updateOn: 'change' },
            );
            return gp;

        } else {
            return this.fb.group({
                Name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                Supply: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                Target: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                UtilityApproach: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)], updateOn: 'change' }),
                Cost: new FormControl(0)  
            },
                { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' });
        }
    }
    addDefaultUtilities(){
        this.fillFormWithData('', DefaultUtilities.hotUtilityStreams, DefaultUtilities.coldUtilityStreams, '', '', '')
    }

    addExchanger(): void {
        this.Exchangers = this.FormG2.get('Exchangers') as FormArray;
        this.Exchangers.push(this.createItem());
        this.disableAll(this.Exchangers.length - 1);
    }

    addUtility(type: string): void {
        if (type === 'hot') {
            this.HotUtilities = this.UtilitiesForm.get('HotUtilities') as FormArray;
            this.HotUtilities.push(this.createUtility('hot'));
        } else {
            this.ColdUtilities = this.UtilitiesForm.get('ColdUtilities') as FormArray;
            this.ColdUtilities.push(this.createUtility('cold'));
        }
    }

    removeExchanger(index: number) {
        let arrayControl: FormArray;
        arrayControl = <FormArray>this.FormG2.controls['Exchangers'];
        localStorage.setItem('F2EX', JSON.stringify(this.FormG2.controls['Exchangers'].value));
        if (arrayControl.length > 2) {
            arrayControl.removeAt(index);
        }
    }

    removeUtility(index: number, type: string) {
        let arrayControl: FormArray;
        if (type === 'hot') {
            arrayControl = <FormArray>this.UtilitiesForm.controls['HotUtilities'];
            localStorage.setItem('F2HU', JSON.stringify(this.UtilitiesForm.controls['HotUtilities'].value));
        } else {
            arrayControl = <FormArray>this.UtilitiesForm.controls['ColdUtilities'];
            localStorage.setItem('F2CU', JSON.stringify(this.UtilitiesForm.controls['ColdUtilities'].value));
        }
        arrayControl.removeAt(index);
    }

    disableInput(type: string, i: number) {
        this.FormG2.get(['Exchangers', i, 'Name']).enable();
        this.FormG2.get(['Exchangers', i, 'Duty']).enable();
        this.FormG2.get(['Exchangers', i, 'UtilityMatch']).enable();

        if (type === '') {
            this.disableAll(i);
        }
        else if (type === '0') {
            this.enableAll(type, i);
        } else if (type === '1') {
            this.FormG2.get(['Exchangers', i, 'coldGroup']).enable();
            this.FormG2.get(['Exchangers', i, 'hotGroup']).reset();
            this.FormG2.get(['Exchangers', i, 'hotGroup']).disable();

        } else if (type === '2') {
            this.FormG2.get(['Exchangers', i, 'hotGroup']).enable();
            this.FormG2.get(['Exchangers', i, 'coldGroup']).reset();
            this.FormG2.get(['Exchangers', i, 'coldGroup']).disable();
        } else {
            this.enableAll('', i);
        }
    }

    disableAll(i: number) {
        this.resetAll(i);
        this.FormG2.get(['Exchangers', i, 'Name']).disable();
        this.FormG2.get(['Exchangers', i, 'hotGroup']).disable();
        this.FormG2.get(['Exchangers', i, 'coldGroup']).disable();
        this.FormG2.get(['Exchangers', i, 'Duty']).disable();
        this.FormG2.get(['Exchangers', i, 'UtilityMatch']).disable();

    }

    resetAll(i: number) {
        this.FormG2.get(['Exchangers', i, 'Name']).reset();
        this.FormG2.get(['Exchangers', i, 'hotGroup', 'hotSupply']).reset();
        this.FormG2.get(['Exchangers', i, 'hotGroup', 'hotTarget']).reset();
        this.FormG2.get(['Exchangers', i, 'coldGroup', 'coldSupply']).reset();
        this.FormG2.get(['Exchangers', i, 'coldGroup', 'coldTarget']).reset();
        this.FormG2.get(['Exchangers', i, 'Duty']).reset();
        this.FormG2.get(['Exchangers', i, 'UtilityMatch']).reset();
    }

    enableAll(type: string, i: number) {
        if (type === '' || type === '1') {
            this.disableAll(i);
        } else {
            this.FormG2.get(['Exchangers', i, 'Name']).enable();
            this.FormG2.get(['Exchangers', i, 'hotGroup']).enable();
            this.FormG2.get(['Exchangers', i, 'coldGroup']).enable();
            this.FormG2.get(['Exchangers', i, 'Duty']).enable();
            this.FormG2.get(['Exchangers', i, 'UtilityMatch']).enable();
        }
    }

    onBlur(i: number, type: string, isName: boolean) {
        // save variables
        switch (type) {
            case 'exchanger':
                this.iStream = i;
                break;

            case 'hotUtility':
                if (isName === true) {
                    let currentName = this.UtilitiesForm.get(['HotUtilities', i, 'Name']).value;
                    this.HotUtilitiesNames = [];
                    this.UtilitiesForm.controls['HotUtilities']['controls'].forEach(a => { this.HotUtilitiesNames.push(a.controls['Name'].value) });
                    if (this.checkDuplicates(this.HotUtilitiesNames, currentName)) {
                        this.UtilitiesForm.get(['HotUtilities', i, 'Name']).setErrors({ 'Duplicate': true })
                    } else if (currentName !== '') {
                        this.UtilitiesForm.get(['HotUtilities', i, 'Name']).setErrors(null)
                    } else {
                        this.UtilitiesForm.get(['HotUtilities', i, 'Name']).setErrors({ 'required': true })
                    }
                }
                this.iHot = i;
                this.iType = 'hotUtility'
                break;

            case 'coldUtility':
                if (isName === true) {
                    let currentName = this.UtilitiesForm.get(['ColdUtilities', i, 'Name']).value;
                    this.ColdUtilitiesNames = [];
                    this.UtilitiesForm.controls['ColdUtilities']['controls'].forEach(a => { this.ColdUtilitiesNames.push(a.controls['Name'].value) });
                    if (this.checkDuplicates(this.ColdUtilitiesNames, currentName)) {
                        this.UtilitiesForm.get(['ColdUtilities', i, 'Name']).setErrors({ 'Duplicate': true })
                    } else if (currentName !== '') {
                        this.UtilitiesForm.get(['ColdUtilities', i, 'Name']).setErrors(null)
                    } else {
                        this.UtilitiesForm.get(['ColdUtilities', i, 'Name']).setErrors({ 'required': true })
                    }
                }
                this.iCold = i;
                this.iType = 'coldUtility'
                break;

            default:
                this.iType = type;
                this.iStream = i;
        }
    }

    onFocus(i: number, type: string) {
        if (i !== this.iStream) {
            this.streamChanged = true
            localStorage.setItem('F2EX', JSON.stringify(this.FormG2.controls['Exchangers'].value));
        } else { this.streamChanged = false }

        if ((i !== this.iStream) ||
            (type !== this.iType) ||
            (type === 'hotUtility' && i !== this.iHot) ||
            (type === 'coldUtility' && i !== this.iCold)) {

            this.streamChanged = true;
            switch (this.iType) {
                case 'exchanger':
                    localStorage.setItem('F2EX', JSON.stringify(this.FormG2.controls['Exchangers'].value));
                    break;
                case 'hotUtility':
                    localStorage.setItem('F2HU', JSON.stringify(this.UtilitiesForm.controls['HotUtilities'].value));
                    break;
                case 'coldUtility':
                    localStorage.setItem('F2CU', JSON.stringify(this.UtilitiesForm.controls['ColdUtilities'].value));
                    break;
                case 'approach':
                    localStorage.setItem('F2AT', JSON.stringify(this.BasicInfoForm.controls['Approach'].value));
                    break;
                case 'caseName':
                    localStorage.setItem('F2CN', JSON.stringify(this.BasicInfoForm.controls['CaseName'].value));
                    break;
                case 'caseDescription':
                    localStorage.setItem('F2CN', JSON.stringify(this.BasicInfoForm.controls['CaseDescription'].value));
                    break;
            }
        } else {
            this.streamChanged = false
        }
    }

    clearData(type: string) {
        this.lc2.case = undefined;


        switch (type) {
            case 'BasicInfo':
                this.localStorageData.BasicInfo = false;
                localStorage.removeItem('F2AT')
                localStorage.removeItem('F2CN')
                localStorage.removeItem('F2CD')
                this.BasicInfoForm.reset()
                this.BasicInfoForm.get('Units').setValue(0);                
                this.BasicInfoForm.get('UtilitiesStage').setValue('Yes');
                break;
            case 'Utilities':
                this.localStorageData.Utilities = false;
                localStorage.removeItem('F2HU')
                localStorage.removeItem('F2CU')
                this.UtilitiesForm.reset()                
                this.clearFormArray(this.HotUtilities)
                this.clearFormArray(this.ColdUtilities)
                break;
            case 'Exchangers':
                this.localStorageData.Exchangers = false;
                this.FormG2.reset();
                localStorage.removeItem('F2EX')
                this.clearFormArray(this.Exchangers)
                this.FormG2.get('DutyType').setValue(0);
                this.addExchanger();
                this.addExchanger();
                break;
        }
    }

    onStepChange() {
        if(this.utilitiesEmpty(this.stepper.selectedIndex)){
            this.BasicInfoForm.get('UtilitiesStage').setValue('No');
            setTimeout(()=>this.stepper.previous(),10);
        }

        if (this.BasicInfoForm.get('UtilitiesStage').value === 'Yes') {
            this.showErrorWithUselessUtilities()
        }
    }

    utilitiesEmpty(index):boolean {
        let utilities = this.UtilitiesForm.value;
        if (utilities.ColdUtilities.length === 0 && 
            utilities.HotUtilities.length === 0 &&
            this.BasicInfoForm.get('UtilitiesStage').value ==='Yes' &&
            index === 1
        ) {
         return true;
        } else {return false}  
    }

    showErrorWithUselessUtilities() {

        this.HotUtilitiesNames = [];
        this.ColdUtilitiesNames = [];

        this.UtilitiesForm.value.HotUtilities.forEach(a => { this.HotUtilitiesNames.push(a.Name) })
        this.UtilitiesForm.value.ColdUtilities.forEach(a => { this.ColdUtilitiesNames.push(a.Name) })

        this.UselessUtilities = []

        let UtilitiesArray = [...this.HotUtilitiesNames, ...this.ColdUtilitiesNames]
        let UsedUtilities = [];

        this.FormG2.value.Exchangers.forEach(a => { UsedUtilities.push(a.UtilityMatch) })

        for (let i = 0; i < UtilitiesArray.length; i++) {
            if (UsedUtilities.indexOf(UtilitiesArray[i]) === -1) {
                this.UselessUtilities.push(UtilitiesArray[i])
            }
        }
    }

    SendData() {
        this.BasicInfoFormData = this.BasicInfoForm.value
        this.UtilitiesFormData = this.UtilitiesForm.value
        this.FormG2Data = this.FormG2.value

        if( this.BasicInfoForm.get('UtilitiesStage').value === 'Yes') {
            this.UtilitiesFormData = this.UtilitiesForm.value            
            this.Exchangers = this.FormG2Data.Exchangers.map(
                a => {
                    if (a.hotGroup !== undefined && a.coldGroup !== undefined) {
                        const obj = {
                            'Name': a.Name, 'hotGroup': a.hotGroup, 'coldGroup': a.coldGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 0, 'Utility': a.UtilityMatch
                        };
                        return obj;
                    }
                    else if (a.hotGroup === undefined) {
                        const obj = { 'Name': a.Name, 'coldGroup': a.coldGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 1, 'Utility': a.UtilityMatch };
                        return obj;
                    }
                    else {
                        const obj = { 'Name': a.Name, 'hotGroup': a.hotGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 2, 'Utility': a.UtilityMatch };
                        return obj;
                    }
                });
        } else {
            this.UtilitiesFormData.HotUtilities  = [];
            this.UtilitiesFormData.ColdUtilities = [];
            this.Exchangers = this.FormG2Data.Exchangers.map(
                a => {
                    if (a.hotGroup !== undefined && a.coldGroup !== undefined) {
                        const obj = {
                            'Name': a.Name, 'hotGroup': a.hotGroup, 'coldGroup': a.coldGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 0, 'Utility': '' };
                        return obj;
                    }
                    else if (a.hotGroup === undefined) {
                        const obj = { 'Name': a.Name, 'coldGroup': a.coldGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 1, 'Utility': '' };
                        return obj;
                    }
                    else {
                        const obj = { 'Name': a.Name, 'hotGroup': a.hotGroup, 'Duty': a.Duty * 1000000, 'exchangerType': 2, 'Utility': '' };
                        return obj;
                    }
                });
        }

        let service = this._PC.postData(
            this.BasicInfoFormData,
            0,//instead of duty type 
            this.Exchangers,
            this.UtilitiesFormData);

        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
            this.SolutionService.response = res;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }

    downloadExcelTemplate() {
        window.open(this._gc.frontStatus() + 'FormTemplates/By_HeatExchanger_Template.xlsx');
    }

    onFileChange(event) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            this.FormUpload.patchValue({ file: reader.result })
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        };
        reader.readAsBinaryString(target.files[0]);
    }

    fillFormWithDataFromExcel(data) {
        this.clearFormArray(this.Exchangers);

        for (let i = 2; i < data.length; i++) {
            if (data[i].count !== 0) {
                let type = 0
                switch (data[i][0]) {
                    case 'Heater':
                        type = 1; break;
                    case 'Cooler':
                        type = 2; break;
                }

                let gp = this.fb.group({
                    Type: new FormControl(type, Validators.required),
                    Name: new FormControl(data[i][1], Validators.required),
                    Duty: new FormControl(parseFloat(data[i][6]), [Validators.required, Validators.min(0), Validators.max(9999)]),
                    UtilityMatch: new FormControl(),
                });

                let hSupp = (type === 1) ? '' : data[i][2];
                let hTar = (type === 1) ? '' : data[i][3];
                let cSupp = (type === 2) ? '' : data[i][4];
                let cTar = (type === 2) ? '' : data[i][5];

                gp.addControl('hotGroup', this.fb.group({
                    hotSupply: new FormControl(parseFloat(hSupp), [Validators.required, Validators.min(-273), Validators.max(10000)]),
                    hotTarget: new FormControl(parseFloat(hTar), [Validators.required, Validators.min(-273), Validators.max(10000)])
                }, { validator: comparisonValidator('hotSupply', 'hotTarget') }));
                gp.addControl('coldGroup', this.fb.group({
                    coldSupply: new FormControl(parseFloat(cSupp), [Validators.required, Validators.min(-273), Validators.max(10000)]),
                    coldTarget: new FormControl(parseFloat(cTar), [Validators.required, Validators.min(-273), Validators.max(10000)])
                }, { validator: comparisonValidator('coldTarget', 'coldSupply') }));
                this.Exchangers.push(gp);

                if (type === 1) this.FormG2.get(['Exchangers', i - 2, 'hotGroup']).disable();
                else if (type === 2) this.FormG2.get(['Exchangers', i - 2, 'coldGroup']).disable();
            }
        }

        if (this.Exchangers.length === 1) { this.addExchanger(); }
        else if (this.Exchangers.length === 0) { this.addExchanger(); this.addExchanger(); }
        this.markFormGroupTouched(this.FormG2)
    }

    SubmitUploadForm() {
        this.fillFormWithDataFromExcel(this.data)
    }

    clearFormArray(arr: FormArray) {
        while (arr.length !== 0) { arr.removeAt(0) }
    }
}

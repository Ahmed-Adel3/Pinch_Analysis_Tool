import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PinchCalculationService } from './pinch-calculation.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { comparisonValidator} from '../comparison-validator';
import { GetSolutionService } from '../solution/get-solution.service';
import { Router } from '@angular/router';
import { SamplesService } from '../../../../layouts/header-nav/samples.service';
import { GlobalSettingsService } from '../../../../../_services/global-settings.service';
import * as XLSX from 'xlsx';
import { LoadCaseService } from './load-case.service';
import { MatHorizontalStepper } from '@angular/material';
import DefaultUtilities from '../DefaultUtilities'

type AOA = any[][];

@Component({
    selector: 'app-pinch-form',
    templateUrl: './pinch-form.component.html',
    styleUrls: ['./pinch-form.component.css'],
})

export class PinchFormComponent implements OnInit {

    @ViewChild('stepper') stepper: MatHorizontalStepper;

    BasicInfoForm: FormGroup;
    UtilitiesForm: FormGroup;
    FormG: FormGroup;
    FormUpload: FormGroup;

    BasicInfoFormData = null;
    UtilitiesFormData = null;
    FormGData = null;

    HotStreams;
    ColdStreams;

    HotUtilities;
    ColdUtilities;
    HotUtilitiesNames = [];
    ColdUtilitiesNames = [];
    UselessUtilities = []; 

    Units = [{ label: 'Metric System (°C | MM Kcal/hr )', value: 0 },
    { label: 'Field Units (°F | MM BTU/hr)', value: 1 }];
    DutyOptions = [{ label: 'Duty', value: 0 },
    { label: 'm * Cp', value: 1 }];
    UtilititesStageSelect = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }];

    iHot: number;
    iCold: number;
    iType: string = '';
    streamChanged: boolean = false;

    localStorageData = {
        BasicInfo: false, Utilities: false, Streams: false
    };


    // upload Excel filoe variables
    data: AOA = [];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    

    constructor(private fb: FormBuilder,
        private _PC: PinchCalculationService,
        private SolutionService: GetSolutionService,
        private router: Router,
        private _service: SamplesService,
        private _gc: GlobalSettingsService,
        private cd: ChangeDetectorRef,
        private lc1: LoadCaseService) {

    }

    ngOnInit() {
        this.InitializaForms()
        this.CheckFillingFormsSource()
    }

    CheckFillingFormsSource() {
        if (localStorage.getItem('F1HS') !== null || localStorage.getItem('F1CS') !== null) { this.localStorageData.Streams = true }
        if (localStorage.getItem('F1HU') !== null || localStorage.getItem('F1CU') !== null) { this.localStorageData.Utilities = true }
        if (localStorage.getItem('F1AT') !== null || localStorage.getItem('F1CN') !== null || localStorage.getItem('F1CD') !== null) { 
            this.localStorageData.BasicInfo = true 
        }


        if (this.lc1.case !== undefined) {
            this.loadData();
        }
        else {
            if (this.localStorageData.Streams !== false) {
                this.addDataFromStorage('Streams')
            } else {
                this.addStream('hot');
                this.addStream('hot');
                this.addStream('cold');
                this.addStream('cold');
            }

            if (this.localStorageData.BasicInfo !== false) {
                this.addDataFromStorage('BasicInfo')
            }

            if (this.localStorageData.Utilities !== false) {
                this.addDataFromStorage('Utilities')
            } else {this.addDefaultUtilities()}
        }
    }

    InitializaForms() {
        this.BasicInfoForm = this.fb.group({
            CaseName: [null, Validators.required],
            CaseDescription: [null],
            Approach: [null, [Validators.required, Validators.min(1)]],
            Units: [0],
            UtilitiesStage: ['Yes',Validators.required]
        })

        this.UtilitiesForm = this.fb.group({
            HotUtilities: this.fb.array([]),
            ColdUtilities: this.fb.array([]),
        })

        this.FormG = this.fb.group({
            DutyType: [0, Validators.required],
            HotStreams: this.fb.array([]),
            ColdStreams: this.fb.array([]),
        });

        this.FormUpload = this.fb.group({
            file: [null, Validators.required]
        });
    }

    createItem(type: string): FormGroup {
        if (type === 'hot') {
            let gp = this.fb.group(
                {
                    Name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                    Supply: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                    Target: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                    Duty: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(9999)], updateOn: 'change' }),
                    UtilityMatch: new FormControl('', { updateOn: 'change' }),

                },
                { validator: comparisonValidator('Supply', 'Target'), updateOn: 'change' },
            );
            return gp;

        } else {
            return this.fb.group({
                Name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                Supply: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                Target: new FormControl('', { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                Duty: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(9999)], updateOn: 'change' }),
                UtilityMatch: new FormControl('', { updateOn: 'change' }),
            },
                { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' });
        }
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
                UtilityApproach: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(1000)], updateOn: 'change' }),
                Cost: new FormControl(0)  
            },
                { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' });
        }
    }

    addDefaultUtilities(){
            this.fillFormWithData('', '', DefaultUtilities.hotUtilityStreams, DefaultUtilities.coldUtilityStreams, '', '', '')
    }

    addDataFromStorage(form: string) {
        switch (form) {
            case 'BasicInfo':
                let AT = JSON.parse(localStorage.getItem('F1AT'));
                let CN = JSON.parse(localStorage.getItem('F1CN'));
                let CD = JSON.parse(localStorage.getItem('F1CD'));
                this.fillFormWithData('', '', '', '', AT, CN, CD)
                break;

            case 'Utilities':
                let HU = JSON.parse(localStorage.getItem('F1HU'));
                let CU = JSON.parse(localStorage.getItem('F1CU'));
                this.fillFormWithData('', '', HU, CU, '', '', '')
                break;

            case 'Streams':
                let HS = JSON.parse(localStorage.getItem('F1HS'));
                let CS = JSON.parse(localStorage.getItem('F1CS'));
                this.fillFormWithData(HS, CS, '', '', '', '', '')
                break;
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

    loadData() {
        console.log('Load Data',this.lc1)
        let HS = this.lc1.case.hotStreams.map(a => { const obj = { Name: a.Name, Supply: a.Supply, Target: a.Target, Duty: (a.Duty / 1000000), Utility: a.Utility }; return obj; });
        let CS = this.lc1.case.coldStreams.map(a => { const obj = { Name: a.Name, Supply: a.Supply, Target: a.Target, Duty: (a.Duty / 1000000), Utility: a.Utility }; return obj; });
        let HU = this.lc1.case.hotUtilityStreams;
        let CU = this.lc1.case.coldUtilityStreams;
        let AT = this.lc1.case.Approach;
        let CN = this.lc1.case.CaseName;
        let CD = this.lc1.case.CaseDescription;

        if(HU.length !== 0 || CU.length !== 0) {
            this.BasicInfoForm.get('UtilitiesStage').setValue('Yes')
        } else {
            this.BasicInfoForm.get('UtilitiesStage').setValue('No')        
        }

        this.fillFormWithData(HS, CS, HU, CU, AT, CN, CD)
    }

    fillFormWithData(HS, CS, HU, CU, AT, CN, CD) {

        if (HS !== '' && CS !== '') {
            this.HotStreams = this.FormG.get('HotStreams') as FormArray;
            this.ColdStreams = this.FormG.get('ColdStreams') as FormArray;

            if (HS !== null) {
                for (let i = 0; i < HS.length; i++) {
                    let gp = this.fb.group(
                        {
                            Name: new FormControl(HS[i].Name, { validators: [Validators.required], updateOn: 'change' }),
                            Supply: new FormControl(HS[i].Supply, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Target: new FormControl(HS[i].Target, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Duty: new FormControl(HS[i].Duty, { validators: [Validators.required, Validators.min(0), , Validators.max(9999)], updateOn: 'change' }),
                            UtilityMatch: new FormControl(HS[i].Utility, { updateOn: 'change' }),
                        },
                        { validator: comparisonValidator('Supply', 'Target'), updateOn: 'change' },
                    );
                    this.HotStreams.push(gp);
                }

                if (HS.lenght === 1) { this.addStream('hot'); }

            } else { this.addStream('hot'); this.addStream('hot'); }

            if (CS !== null) {
                for (let i = 0; i < CS.length; i++) {
                    let gp = this.fb.group(
                        {
                            Name: new FormControl(CS[i].Name, { validators: [Validators.required], updateOn: 'change' }),
                            Supply: new FormControl(CS[i].Supply, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Target: new FormControl(CS[i].Target, { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                            Duty: new FormControl(CS[i].Duty, { validators: [Validators.required, Validators.min(0), Validators.max(9999)], updateOn: 'change' }),
                            UtilityMatch: new FormControl(CS[i].Utility, { updateOn: 'change' }),
                        },
                        { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' },
                    );
                    this.ColdStreams.push(gp);
                }


                if (CS.lenght === 1) { this.addStream('cold'); }

            } else { this.addStream('cold'); this.addStream('cold'); }

            this.markFormGroupTouched(this.FormG)
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

        if (AT !== '' || CN !== '' || CD !== '') {
            this.BasicInfoForm.get('Approach').setValue(AT);
            this.BasicInfoForm.get('CaseName').setValue(CN);
            this.BasicInfoForm.get('CaseDescription').setValue(CD);
            this.markFormGroupTouched(this.BasicInfoForm)
        }
    }

    addStream(type: string): void {
        if (type === 'hot') {
            this.HotStreams = this.FormG.get('HotStreams') as FormArray;
            this.HotStreams.push(this.createItem('hot'));
        } else {
            this.ColdStreams = this.FormG.get('ColdStreams') as FormArray;
            this.ColdStreams.push(this.createItem('cold'));
        }
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

    removeStream(index: number, type: string) {
        let arrayControl: FormArray;
        if (type === 'hot') {
            arrayControl = <FormArray>this.FormG.controls['HotStreams'];
            localStorage.setItem('F1HS', JSON.stringify(this.FormG.controls['HotStreams'].value));
        } else {
            arrayControl = <FormArray>this.FormG.controls['ColdStreams'];
            localStorage.setItem('F1CS', JSON.stringify(this.FormG.controls['ColdStreams'].value));
        }
        if (arrayControl.length > 2) {
            arrayControl.removeAt(index);
        }
    }

    removeUtility(index: number, type: string) {
        let arrayControl: FormArray;
        if (type === 'hot') {
            arrayControl = <FormArray>this.UtilitiesForm.controls['HotUtilities'];
            localStorage.setItem('F1HU', JSON.stringify(this.UtilitiesForm.controls['HotUtilities'].value));
        } else {
            arrayControl = <FormArray>this.UtilitiesForm.controls['ColdUtilities'];
            localStorage.setItem('F1CU', JSON.stringify(this.UtilitiesForm.controls['ColdUtilities'].value));
        }
        arrayControl.removeAt(index);
    }

    onBlur(i: number, type: string, isName: boolean) {
        // save variables
        switch (type) {
            case 'hotStream':
                this.iHot = i;
                this.iType = 'hotStream'
                break;

            case 'coldStream':
                this.iCold = i;
                this.iType = 'coldStream'
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
                        this.UtilitiesForm.get(['ColdHotUtilities', i, 'Name']).setErrors(null)
                    } else {
                        this.UtilitiesForm.get(['ColdUtilities', i, 'Name']).setErrors({ 'required': true })
                    }
                }
                this.iCold = i;
                this.iType = 'coldUtility'
                break;

            default:
                this.iType = type;
        }
    }

    // to save in local storage on stream change
    onFocus(i: number, type: string) {
        if ((type !== this.iType) || (type === 'hotStream' && i !== this.iHot) || (type === 'coldStream' && i !== this.iCold)
            || (type === 'hotUtility' && i !== this.iHot) || (type === 'coldUtility' && i !== this.iCold)) {
            this.streamChanged = true;
            switch (this.iType) {
                case 'hotStream':
                    localStorage.setItem('F1HS', JSON.stringify(this.FormG.controls['HotStreams'].value));
                    break;
                case 'coldStream':
                    localStorage.setItem('F1CS', JSON.stringify(this.FormG.controls['ColdStreams'].value));
                    break;
                case 'hotUtility':
                    localStorage.setItem('F1HU', JSON.stringify(this.UtilitiesForm.controls['HotUtilities'].value));
                    break;
                case 'coldUtility':
                    localStorage.setItem('F1CU', JSON.stringify(this.UtilitiesForm.controls['ColdUtilities'].value));
                    break;
                case 'approach':
                    localStorage.setItem('F1AT', JSON.stringify(this.BasicInfoForm.controls['Approach'].value));
                    break;
                case 'caseName':
                    localStorage.setItem('F1CN', JSON.stringify(this.BasicInfoForm.controls['CaseName'].value));
                    break;
                case 'caseDescription':
                    localStorage.setItem('F1CN', JSON.stringify(this.BasicInfoForm.controls['CaseDescription'].value));
                    break;
            }
        } else {
            this.streamChanged = false
        }
    }

    clearData(type: string) {

        this.lc1.case = undefined;

        switch (type) {
            case 'BasicInfo':
                this.localStorageData.BasicInfo = false;           
                localStorage.removeItem('F1AT')
                localStorage.removeItem('F1CN')
                localStorage.removeItem('F1CD')
                this.BasicInfoForm.reset()
                this.BasicInfoForm.get('Units').setValue(0);                
                this.BasicInfoForm.get('UtilitiesStage').setValue('Yes');
                break;
            case 'Utilities':
                this.localStorageData.Utilities = false;           
                localStorage.removeItem('F1HU')
                localStorage.removeItem('F1CU')
                this.UtilitiesForm.reset()                
                this.clearFormArray(this.HotUtilities)
                this.clearFormArray(this.ColdUtilities)
                break;
            case 'Streams':
                this.localStorageData.Streams = false;            
                localStorage.removeItem('F1HS')
                localStorage.removeItem('F1CS')
                this.FormG.reset()  
                this.clearFormArray(this.HotStreams);
                this.clearFormArray(this.ColdStreams);
                this.FormG.get('DutyType').setValue(0);
                this.addStream('hot');
                this.addStream('hot');
                this.addStream('cold');
                this.addStream('cold');
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

        this.FormG.value.HotStreams.forEach(a => { UsedUtilities.push(a.UtilityMatch) })
        this.FormG.value.ColdStreams.forEach(a => { UsedUtilities.push(a.UtilityMatch) })

        for (let i = 0; i < UtilitiesArray.length; i++) {
            if (UsedUtilities.indexOf(UtilitiesArray[i]) === -1) {
                this.UselessUtilities.push(UtilitiesArray[i])
            }
        }
    }

    SendData() {
        this.BasicInfoFormData = this.BasicInfoForm.value
        this.FormGData = this.FormG.value

        if( this.BasicInfoForm.get('UtilitiesStage').value === 'Yes') {
            this.UtilitiesFormData = this.UtilitiesForm.value      
            this.HotStreams = this.FormGData.HotStreams.map(
                a => {
                    var exchangerType = (a.UtilityMatch==='')?0:1
                    const obj = { 'Name': a.Name, 'Supply': a.Supply, 'Target': a.Target, 'Duty': a.Duty * 1000000, 'exchangerType': exchangerType, 'Utility': a.UtilityMatch };
                    return obj;
                });
            this.ColdStreams = this.FormGData.ColdStreams.map(
                a => {
                    var exchangerType = (a.UtilityMatch==='')?0:2
                    const obj = { 'Name': a.Name, 'Supply': a.Supply, 'Target': a.Target, 'Duty': a.Duty * 1000000, 'exchangerType': exchangerType, 'Utility': a.UtilityMatch };
                    return obj;
                });
        } else {
            this.HotStreams = this.FormGData.HotStreams.map(
                a => {
                    const obj = { 'Name': a.Name, 'Supply': a.Supply, 'Target': a.Target, 'Duty': a.Duty * 1000000, 'exchangerType': 0, 'Utility': '' };
                    return obj;
                });
            this.ColdStreams = this.FormGData.ColdStreams.map(
                a => {
                    const obj = { 'Name': a.Name, 'Supply': a.Supply, 'Target': a.Target, 'Duty': a.Duty * 1000000, 'exchangerType': 0, 'Utility': '' };
                    return obj;
                });
        }

        const service = this._PC.postData(
                this.BasicInfoFormData,
                this.HotStreams,
                this.ColdStreams,
                this.FormGData.DutyType,
                this.UtilitiesFormData);
                
        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
                this.SolutionService.response = res;
                this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }

    downloadExcelTemplate() {
        window.open(this._gc.frontStatus() + 'FormTemplates/By_Stream_Template.xlsx');
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

        this.clearFormArray(this.HotStreams);
        this.clearFormArray(this.ColdStreams);

        for (let i = 2; i < data.length; i++) {
            if (data[i].count !== 0) {
                let gpHot = this.fb.group(
                    {
                        Name: new FormControl(data[i][0], { validators: [Validators.required], updateOn: 'change' }),
                        Supply: new FormControl(parseFloat(data[i][1]), { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                        Target: new FormControl(parseFloat(data[i][2]), { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                        Duty: new FormControl(parseFloat(data[i][3]), { validators: [Validators.required, Validators.min(0), , Validators.max(9999)], updateOn: 'change' }),
                        UtilityMatch: new FormControl(''),
                    },
                    { validator: comparisonValidator('Supply', 'Target'), updateOn: 'change' },
                );
                this.HotStreams.push(gpHot);

                let gpCold = this.fb.group(
                    {
                        Name: new FormControl(data[i][5], { validators: [Validators.required], updateOn: 'change' }),
                        Supply: new FormControl(parseFloat(data[i][6]), { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                        Target: new FormControl(parseFloat(data[i][7]), { validators: [Validators.required, Validators.min(-273), Validators.max(10000)], updateOn: 'change' }),
                        Duty: new FormControl(parseFloat(data[i][8]), { validators: [Validators.required, Validators.min(0), Validators.max(9999)], updateOn: 'change' }),
                        UtilityMatch: new FormControl(''),
                    },
                    { validator: comparisonValidator('Target', 'Supply'), updateOn: 'change' },
                );
                this.ColdStreams.push(gpCold);
           }
        }

        if (this.HotStreams.length === 1) { this.addStream('hot'); }
        else if (this.HotStreams.length === 0) { this.addStream('hot'); this.addStream('hot'); }

        if (this.ColdStreams.length === 1) { this.addStream('cold'); }
        else if (this.ColdStreams.length === 0) { this.addStream('cold'); this.addStream('cold'); }

        this.markFormGroupTouched(this.FormG)
    }

    SubmitUploadForm() {
        this.fillFormWithDataFromExcel(this.data)
        console.log(this.FormG)
    }

    clearFormArray(arr: FormArray) {
        while (arr.length !== 0) { arr.removeAt(0) };
    }
}
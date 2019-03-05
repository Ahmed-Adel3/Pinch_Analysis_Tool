import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styles: []
})
export class ResetPasswordComponent implements OnInit {

    resetPass: FormGroup
    token;
    data;
    Email;
    loading = false;

    constructor(private fb: FormBuilder, private Arouter: ActivatedRoute, private router: Router, private _RP: ResetPasswordService) {
        this.Arouter.queryParams.subscribe(a => {
            this.token = a['token']
        })
    }

    ngOnInit() {
        this.resetPass = this.fb.group({
            Email: [this.Email, [Validators.required, Validators.email]],
            newPassword: [null, [Validators.required]],
            confirmNewPassword: [null, [Validators.required]]
        }, { validator: this.comparisonValidator("newPassword", "confirmNewPassword") })

    }


    comparisonValidator(firstKey: string, secondKey: string): ValidatorFn {
        return (group: FormGroup): { [key: string]: any } => {
            const first = group.controls[firstKey];
            const second = group.controls[secondKey];

            if (!first.pristine && !second.pristine) {
                const equal = first.value === second.value;
                if (!equal && first.valid && second.valid) {
                    second.setErrors({ notEqual: firstKey });
                    const message = firstKey + ' != ' + secondKey;
                    return { message };
                }
                if (equal && second.hasError('notEqual')) {
                    second.setErrors(null);
                }
            }

            return null;
        };
    }


    SendData(Data) {
        let Service = this._RP.resetPass(Data.Email, this.token, Data.newPassword, Data.confirmNewPassword);

        Service.subscribe(data => {
            this.router.navigate(['']);
        },
            error => {
                let errorMessage = "";
                let modelState = JSON.parse(error._body).modelState;
                let fieldsErrorsArr:Array<Array<string>> = Object.values(modelState);
                for (let i = 0; i < fieldsErrorsArr.length; i++) {
                    for (let j = 0; j < fieldsErrorsArr[i].length; j++) {
                        errorMessage += " , " + fieldsErrorsArr[i][j]
                    }
                }
                this.data = errorMessage.substring(2, errorMessage.length - 1)
            }
        )
    }


}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SetPasswordService } from './set-password.service';

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styles: []
})
export class SetPasswordComponent implements OnInit {
    setPass: FormGroup
    userId;
    data;
    loading = false;

    constructor(private fb: FormBuilder, private Arouter: ActivatedRoute, private router: Router, private _SP: SetPasswordService) {
        this.Arouter.params.subscribe(a => {
            this.userId = a.id
        })

    }

    ngOnInit() {
        this.setPass = this.fb.group({
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
        let Service = this._SP.setPass(this.userId, Data.newPassword, Data.confirmNewPassword);

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

import { FormGroup, ValidatorFn } from '@angular/forms';

export function comparisonValidator(firstKey: string, secondKey: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
        const first = group.controls[firstKey];
        const second = group.controls[secondKey];

            const islarger = first.value >= (second.value+1);
            if (!islarger && first.valid && second.valid) {
                second.setErrors({ largerValue: firstKey });
                const message = firstKey + ' > ' + secondKey;
                return { message };
            }
            if (islarger && second.hasError('largerValue')) {
                second.setErrors(null);
            }
    };
}

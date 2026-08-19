import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.trim();

        if (!value) {
            return { invalidURL: true };
        }

        try {
            const url = new URL(value);

            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return { invalidURL: true };
            }

            return null;
        } catch {
            return { invalidURL: true };
        }
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const value = control.value;
        const validEmail = emailPattern.test(value);
        return validEmail ? null : { invalidEmail: true };
    };
}

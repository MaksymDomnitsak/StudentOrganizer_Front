import { AbstractControl, ValidatorFn } from '@angular/forms';

export function atLeastOneValidator(controlNames: string[]): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const isAtLeastOneFilled = controlNames.some(controlName => {
      const control = formGroup.get(controlName);
      return control && control.value && control.value.trim() !== '';
    });

    return isAtLeastOneFilled ? null : { atLeastOneRequired: true };
  };
}
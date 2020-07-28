import { FormControl, FormGroup } from '@angular/forms'

export class CustomValidators {
    static confirmPassword(formPassword: string, formConfirmPassword: string){
        return (form: FormGroup) => {
            let password = form.controls[formPassword];
            let confirmPassword = form.controls[formConfirmPassword];
            
            if (confirmPassword.errors && !confirmPassword.errors.mustMatch) {
                return;
            }
            if (password.value !== confirmPassword.value) {
                confirmPassword.setErrors({ mustMatch: true });
            }else{
                confirmPassword.setErrors(null);
            }
            
        }
      
    }
}
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Router } from '@angular/router';
import { FormControl, AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  state: any;
  nameControl: FormControl;
  emailControl: FormControl;
  pwControl: FormControl;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private validService: ValidationService
  ) { }

  ngOnInit() {
    this.nameControl  = new FormControl('', {validators: [this.nameValidator.bind(this)], updateOn: 'blur'});
    this.emailControl = new FormControl('', [this.emailValidator.bind(this)]);
    this.pwControl    = new FormControl('', [this.pwValidator.bind(this)]);
    this.state = {success: true};
  }

  submit() {
    const user = {
      name      :  this.nameControl.value,
      email     :  this.emailControl.value,
      password  :  this.pwControl.value
    };
    this.authService.signup(user).subscribe(data => {
      const res = JSON.parse(data._body);
      if (res.success) {
        this.router.navigate(['']);
      } else {
        this.state = res;
      }
    });
  }

  nameValidator(control: AbstractControl) {
    const msg = {name: control.value};
    return this.validService.checkName(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {nameValidator : !val.valid, nameValidatorMsg: val.msg};
            }),
    ).subscribe(val => {
      if (val.nameValidator) {
        control.setErrors(val);
      } else {
        control.setErrors(null);
      }
    });
  }

  emailValidator(control: AbstractControl) {
    const msg = {email: control.value};
    return this.validService.checkEmail(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {emailValidator : !val.valid, emailValidatorMsg: val.msg};
            }),
    ).subscribe(val => {
      if (val.emailValidator) {
        control.setErrors(val);
      } else {
        control.setErrors(null);
      }
    });
  }

  pwValidator(control: AbstractControl) {
    const msg = {pw: control.value};
    return this.validService.checkPw(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {pwValidator : !val.valid, pwValidatorMsg: val.msg};
            }),
    ).subscribe(val => {
      if (val.pwValidator) {

        control.setErrors(val);
      } else {
        control.setErrors(null);
      }
    });
  }
}

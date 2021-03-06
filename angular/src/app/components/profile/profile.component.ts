import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationService } from 'src/app/services/validation.service';
import { FormControl, AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  newuser:  Object;
  response:  any;
  edit:  boolean;
  nameControl: FormControl;
  emailControl: FormControl;
  pwControl: FormControl;

  constructor(
    private authService: AuthenticationService,
    private validService: ValidationService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.newuser = {
      _id      : this.authService.user._id,
      name     : this.authService.user.name,
      email    : this.authService.user.email,
      password : ''
    };
    this.nameControl  = new FormControl(
      {value: this.authService.user['name'], disabled: true}, {validators: [this.nameValidator.bind(this)], updateOn: 'blur'}
      );
    this.emailControl = new FormControl({value: this.authService.user['email'], disabled: true}, [this.emailValidator.bind(this)]);
    this.pwControl    = new FormControl({value: '', disabled: true}, [this.pwValidator.bind(this)]);
    this.edit = false;
    this.response = {
      success : true,
      msg     : ''
    };
  }
  editMode(state) {
    this.edit = state;
    if (state) {
      this.nameControl.enable();
      this.emailControl.enable();
      this.pwControl.enable();
    } else {
      this.nameControl.disable();
      this.emailControl.disable();
      this.pwControl.disable();
      this.nameControl.setValue(this.authService.user['name']);
      this.emailControl.setValue(this.authService.user['email']);
      this.pwControl.setValue('');
    }
  }
  isDisabled() {
    return !this.edit;
  }
  submit() {
    let user = {
      name      :  this.nameControl.value,
      email     :  this.emailControl.value,
      password  :  this.pwControl.value
    };
    this.authService.updateUser(user).subscribe(data => {
      const res = JSON.parse(data._body);
      if (res.success) {
        this.editMode(false);
        this.authService.signin(user).subscribe(payload => {
          const result = JSON.parse(payload._body);
            if (result.success) {
              this.authService.setSession(result.token);
              user = null;
              this.newuser['password'] = '';
              this.pwControl.setValue('');
              this.nameControl.setValue(this.authService.user['name']);
              this.emailControl.setValue(this.authService.user['email']);
            } else {
              this.response = result;
            }
        });
      } else {
        this.response = res;
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
    const msg = {newEmail: control.value, oldEmail: this.authService.user.email};
    return this.validService.checkEmailOnUpdate(msg)
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

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {title: 'Delete', message: 'Are you sure you want to delete the account?'}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.authService.deleteUser().subscribe(payload => {
          const result = JSON.parse(payload._body);
            if (result.success) {
              this.authService.logout();
              this.router.navigate(['']);
            } else {
              this.response = result;
            }
        });
      }
    });
  }
}

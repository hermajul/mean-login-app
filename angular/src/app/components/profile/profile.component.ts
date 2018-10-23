import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationService } from 'src/app/services/validation.service';
import { FormControl, AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  newuser   :  Object;
  response  :  any;
  edit      :  boolean;  
  nameControl : FormControl;
  emailControl : FormControl;
  pwControl : FormControl;

  constructor(
    private authService : AuthenticationService,
    private validService: ValidationService
  ) { }

  ngOnInit() {
    this.newuser = {
      _id      : this.authService.user._id,
      name     : this.authService.user.name,
      email    : this.authService.user.email,
      password : ""
    }
    this.nameControl  = new FormControl({value: this.authService.user['name'], disabled: true}, {validators:[this.nameValidator.bind(this)], updateOn:'blur'});  
    this.emailControl = new FormControl({value: this.authService.user['email'], disabled: true}, [this.emailValidator.bind(this)]);  
    this.pwControl    = new FormControl({value: '', disabled: true}, [this.pwValidator.bind(this)]);
    this.edit = false;
    this.response = {
      success : true,
      msg     : ""
    }
  }
  editMode(state){
    this.edit = state;
    if(state){
      this.nameControl.enable();
      this.emailControl.enable();
      this.pwControl.enable();
    }else{
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
  submit(){
    var user = {
      name      :  this.nameControl.value,
      email     :  this.emailControl.value,
      password  :  this.pwControl.value
    }
    this.authService.updateUser(user).subscribe(data => {
      var res = JSON.parse(data._body);
      if(res.success) {
        this.editMode(false);
        this.authService.signin(user).subscribe(data => {
          var res = JSON.parse(data._body);
            if(res.success) {
              this.authService.setSession(res.token);
              user = null;
              this.newuser['password'] = "";
              this.pwControl.setValue("");
              this.nameControl.setValue(this.authService.user['name']);
              this.emailControl.setValue(this.authService.user['email']);
            } else {
              this.response = res;
            }
        });
      } else {
        this.response = res;
      }
    });
  }
  nameValidator(control: AbstractControl) {
    var msg = {name:control.value};
    return this.validService.checkName(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {nameValidator : !val.valid, nameValidatorMsg: val.msg}
            }),
    ).subscribe(val => {
      if(val.nameValidator){
        control.setErrors(val);
      }else{
        control.setErrors(null);
      }
    });
  }

  emailValidator(control: AbstractControl) {
    var msg = {newEmail:control.value,oldEmail:this.authService.user.email};
    return this.validService.checkEmailOnUpdate(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {emailValidator : !val.valid, emailValidatorMsg: val.msg}
            }),
    ).subscribe(val => {    
      if(val.emailValidator){        
        control.setErrors(val);
      }else{
        control.setErrors(null);
      }
    });
  }

  pwValidator(control: AbstractControl) {
    var msg = {pw:control.value};
    return this.validService.checkPw(msg)
    .pipe(  map( response => response.json()),
            map( val => {
              return {pwValidator : !val.valid, pwValidatorMsg: val.msg}
            }),
    ).subscribe(val => {      
      if(val.pwValidator){
        
        control.setErrors(val);
      }else{
        control.setErrors(null);
      }
    });
  }
}

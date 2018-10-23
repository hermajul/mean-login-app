import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user      :   Object;
  response  :   any;

  constructor(
    private authService: AuthenticationService,
    private router      : Router
  ) { }

  ngOnInit() {
    this.user = {
      email     : "",
      password  : ""
    }
    this.response = {
      success : true,
      msg     : ""
    }
  }

  submit(){
    this.authService.signin(this.user).subscribe(data => {
      var res = JSON.parse(data._body);
        if(res.success) {
          this.authService.setSession(res.token);
          this.router.navigate(['dashboard']);
        } else {
          this.response = res;
        }
    });
  }

}


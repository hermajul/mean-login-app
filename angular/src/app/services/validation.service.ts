import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private http  : Http,
  ) { }

  checkName(name):Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/namevalidator', name, {headers: headers});
  }
  checkEmail(email):Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/emailvalidator', email, {headers: headers});
  }
  checkEmailOnUpdate(email):Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/emailonupdatevalidator', email, {headers: headers});
  }
  checkPw(pw):Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/pwvalidator', pw, {headers: headers});
  }
}

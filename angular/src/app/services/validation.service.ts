import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private http: Http,
  ) { }

  checkName(name): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('validators/namevalidator', name, {headers: headers});
  }
  checkEmail(email): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('validators/emailvalidator', email, {headers: headers});
  }
  checkEmailOnUpdate(email): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('validators/emailonupdatevalidator', email, {headers: headers});
  }
  checkPw(pw): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('validators/pwvalidator', pw, {headers: headers});
  }
}

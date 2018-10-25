import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: any;
  user: any;

  constructor(
    private http: Http,
    ) { }

  getUser() {
    this.loadToken();
    return this.user;
  }
  getToken() {
    this.loadToken();
    return this.token;
  }

  signin(user): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/signin', user, {headers: headers});
  }
  signup(user): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/signup', user, {headers: headers});
  }
  setSession(token) {
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(decoded.data));
    this.token = token;
    this.user = decoded.data;
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    const user  = JSON.parse(localStorage.getItem('user'));
    this.token  = token;
    this.user   = user;
  }
  isLoggedIn() {
    const helper = new JwtHelperService();
    this.loadToken();
    return !helper.isTokenExpired(this.token);
  }
  logout() {
    this.token  = null;
    this.user   = null;
    localStorage.clear();
  }
  updateUser(newuser): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.post('users/update', newuser, {headers: headers});
  }
  getuser(users): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.post('users/getprofile', users, {headers: headers});
  }
}

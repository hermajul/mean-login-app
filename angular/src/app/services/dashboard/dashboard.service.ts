import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http  : Http,
    private authService : AuthenticationService
  ) { }

  dashboard():Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());
    return this.http.post('dashboard/welcome',{}, {headers: headers});
  }

}

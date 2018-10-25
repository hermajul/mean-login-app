import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DashboardService} from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  content: any;

  constructor(
    private dashService: DashboardService
  ) { }

  ngOnInit() {
    this.dashService.dashboard().subscribe(data => {
      this.content = JSON.parse(data._body);
    });
  }

}

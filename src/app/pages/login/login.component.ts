import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import "angular2-navigate-with-data";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public error: string = '';
 
  public loading: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

  }

  public getAuth(){
    return this.auth;
  }
  
  public async login() {
    this.loading = true;
    this.error = '';

    try {
      await this.auth.login(this.email, this.password);
      const navigatedData = this.router.getNavigatedData();

      if (navigatedData && typeof navigatedData.url !== 'undefined') {
        this.router.navigateByData({
          url: navigatedData.url,
          data: navigatedData
        });
      } else {
        this.router.navigate(['my-page']);
      }
    } catch (err) {
      this.error = err;
    }
    this.loading = false;
  }

  register() {
    const navigatedData = this.router.getNavigatedData();
    if (navigatedData) {
      this.router.navigateByData({
        url: ['register'],
        data: navigatedData
      });
    } else {
      this.router.navigate(['register']);
    }
  }
  
  needsLogin(){
    return this.auth.isLoggedIn;
  }
}

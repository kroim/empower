import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'angular2-navigate-with-data';

@Component({
  selector: 'app-newlogin',
  templateUrl: './newlogin.component.html',
  styleUrls: ['./newlogin.component.scss']
})
export class NewloginComponent implements OnInit {

  public email: string;
  public password: string;
  public error: string;

  public loading: boolean;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.error = '';
    this.loading = false;
  }
  public async new_login() {
    if (this.email === '' || this.password === '') {
      this.error = 'Empty email or password';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else {
      try {
        const authInfo = await this.auth.login(this.email, this.password);
      } catch (err) {
        this.error = err;
      }
    }
  }

}

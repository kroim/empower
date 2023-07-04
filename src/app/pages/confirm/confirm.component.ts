import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  public error: string = '';
  public confirmCode: string = '';
  public comingFromEmail: boolean = false;

  constructor(private auth: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.confirmationCode) {
          this.comingFromEmail = true;
          this.confirmCode = params.confirmationCode;
          this.confirm();
        }
      });
  }

  public async confirm() {
    try {
      await this.auth.confirm(this.confirmCode);
      this.router.navigate(['my-page']);
    } catch (err) {
      this.error = err;
    }
  }

}

import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"]
})
export class ChangePasswordComponent implements OnInit {
  public password: string = "";
  public repeatPassword: string = "";
  public resetCode: string = "";
  public error: string = "";

  constructor(private user: UserService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.resetCode) {
          this.resetCode = params.resetCode;
        }
      });
  }

  async changePassword() {
    this.error = "";

    if (this.password !== this.repeatPassword) {
      this.error = "Passwords does not match";
    } else {
      if (this.resetCode && this.resetCode !== "") {
        await this.user.changePassword(this.password, this.resetCode);
        this.router.navigate(["login"]);
      }
      try {
        await this.user.changePassword(this.password);
        this.router.navigate([""]);
      } catch (err) {
        this.error = err;
      }
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  public email: string = "";
  public password: string = "";
  public repeatPassword: string = "";
  public error: string = "";
  public newsletter: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  public async register() {
    if (this.password !== this.repeatPassword) {
      this.error = "Passwords does not match";
    } else if (this.password.length < 8) {
      this.error = "Passwords needs to be at least 8 characters long";
    } else {
      try {
        await this.auth.register(this.email, this.password, this.newsletter);

        const navigatedData = this.router.getNavigatedData();

        if (navigatedData && typeof navigatedData.url !== "undefined") {
          this.router.navigateByData({
            url: navigatedData.url,
            data: navigatedData
          });
        } else {
          this.router.navigate(["my-page"]);
        }
      } catch (err) {
        this.error = err;
      }
    }
  }
}

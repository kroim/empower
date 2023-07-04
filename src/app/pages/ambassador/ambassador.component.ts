import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-ambassador",
  templateUrl: "./ambassador.component.html",
  styleUrls: ["./ambassador.component.scss"]
})
export class AmbassadorComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public name: string = "";
  public country: string = "";
  public why: string = "";
  public how: string = "";
  public relevant: string = "";
  public involved: string = "";
  public social: string = "";

  public applied: boolean = false;
  public err: string = "";

  public ambassadorId: string;

  constructor(
    auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.isLoggedIn = auth.isLoggedIn;

    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.ambassadorId = params.id;
      }
    });
  }

  ngOnInit() {
    const navigatedData = this.router.getNavigatedData();
    if (
      navigatedData &&
      navigatedData.url &&
      navigatedData.url[0] &&
      navigatedData.url[0] === "ambassador"
    ) {
      const element = document.querySelector("#apply");
      if (element) {
        element.scrollIntoView(true);
      }
    }
  }

  logIn() {
    this.router.navigateByData({
      url: ["login"],
      data: {
        url: ["ambassador"]
      }
    });
  }

  submit() {
    if (this.name === "") {
      this.err = "Name is missing";
    } else if (this.country === "") {
      this.err = "Country is missing";
    } else if (this.why === "") {
      this.err = "Why would you like to become an Empower ambassador? is missing";
    } else if (this.how === "") {
      this.err = "How would you like to contribute? is missing";
    } else if (this.relevant === "") {
      this.err = "Relevant education/knowledge? is missing";
    } else if (this.involved === "") {
      this.err = "How involved would you like to be/how much time do you have? is missing"
    } else {
      this.userService
        .applyForAmbassador(
          this.name,
          this.country,
          this.why,
          this.how,
          this.relevant,
          this.involved,
          this.social
        )
        .then(() => {
          this.applied = true;
          this. err = "";
        })
        .catch(err => {
          this.err = err;
        });
    }
  }
}

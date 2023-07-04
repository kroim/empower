import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  private selected: string = "";

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.selected = event.url;
      });
  }

  toggleMenu() {
    let nav = document.getElementById("navigation-items-block");
    if (nav.className === "navigation-items") {
      nav.className += " show-small";
    } else {
      nav.className = "navigation-items";
    }
  }

  getTextDecorationStyle(link) {
    if (link === "/") {
      return link === this.selected;
    } else {
      return this.selected.startsWith(link);
    }
  }

  goTo(location: string) {
    this.router.navigate([location]);
    this.toggleMenu();
    console.log(this.auth);
  }

  goHome() {
    this.router.navigate([""]);
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn;
  }
}

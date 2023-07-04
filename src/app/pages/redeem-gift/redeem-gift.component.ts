import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";

@Component({
  selector: "app-redeem-gift",
  templateUrl: "./redeem-gift.component.html",
  styleUrls: ["./redeem-gift.component.scss"]
})
export class RedeemGiftComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {}

  public loading: boolean = false;
  public code: string = '';
  public error: string;

  async redeem() {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByData({
        url: ["login"],
        data: {
          code: this.code,
          url: ["redeem-gift"]
        }
      });
    } else {
      this.loading = true;
      try {
        await this.orderService.redeemGift(this.code);
        this.loading = false;
        this.router.navigate(["my-page"]);
      } catch (err) {
        this.error = err;
        this.loading = false;
      }
    }
  }

  ngOnInit() {
    const navigatedData = this.router.getNavigatedData();
    if (navigatedData && navigatedData.code) {
      this.code = navigatedData.code;

      if (!this.authService.isLoggedIn) {
        this.router.navigateByData({
          url: ["login"],
          data: {
            code: this.code,
            url: ["redeem-gift"]
          }
        });
      }
    }

    this.activatedRoute.queryParams.subscribe(_params => {
      if (typeof _params.code !== "undefined") {
        this.code = _params.code;

        if (!this.authService.isLoggedIn) {
          this.router.navigateByData({
            url: ["login"],
            data: {
              code: this.code,
              url: ["redeem-gift"]
            }
          });
        }
      }
    });
  }
}

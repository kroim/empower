import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PaymentService } from "../../services/payment.service";
import { Router } from "@angular/router";
import "angular2-navigate-with-data";

@Component({
  selector: "app-checkout-done",
  templateUrl: "./checkout-done.component.html",
  styleUrls: ["./checkout-done.component.scss"]
})
export class CheckoutDoneComponent implements OnInit {
  public loading: boolean = false;
  public error: string;
  public isGift = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private payment: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const paymentType = params["payment"];
      const type = params["type"];
      const token = params["token"];
      this.isGift = (params["isGift"] === "true");

      if (paymentType === "paypal" && type === "subscription") {
        this.loading = true;
        this.payment
          .exectuePaypalSubscription(token)
          .then(() => {
            this.loading = false;
            this.router.navigate(["checkout-done"], {
              queryParams: {},
              queryParamsHandling: "merge"
            });
          })
          .catch(err => {
            this.loading = false;
            this.error = err;
          });
      } else if (paymentType === "paypal" && type === "onetime") {
        this.loading = true;
        this.payment
          .exectuePaypalOnetime(params["paymentId"], params["PayerID"])
          .then(() => {
            this.loading = false;
            this.router.navigate(["checkout-done"], {
              queryParams: {},
              queryParamsHandling: "merge"
            });
          })
          .catch(err => {
            this.loading = false;
            this.error = err;
          });
      }
    });
  }
}

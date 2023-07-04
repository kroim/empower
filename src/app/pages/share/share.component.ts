import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { OrderService } from "../../services/order.service";
import { ActivatedRoute } from "@angular/router";
import { FacebookService } from "../../services/facebook.service";
declare var FB: any;

const SHARE_TEXT_BASE =
  "#plasticwastemovement #empowerplastic #empoweroceans #tavaha #realimpact";

@Component({
  selector: "app-share",
  templateUrl: "./share.component.html",
  styleUrls: ["./share.component.scss"]
})
export class ShareComponent implements OnInit {
  private queryParamsOverride = false;
  public shareText: string =
    "Empower is cleaning the world from plastic waste! Check it out at https://empower.eco\n" +
    SHARE_TEXT_BASE;

  constructor(
    order: OrderService,
    auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private facebookService: FacebookService
  ) {
    if (auth.isLoggedIn) {
      order.getTotalAmountForUser().then(res => {
        if (!this.queryParamsOverride) {
          const yearlyRate = (res as any).rate * 60 * 60 * 24 * 30 * 12;
          this.shareText =
            "I'm funding clean-up of more than " +
            yearlyRate.toFixed(0) +
            " kgs of plastic waste every year!\n" +
            "Join me and make an impact with www.empower.eco\n" +
            SHARE_TEXT_BASE;
        }
      });
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.yearlyRate) {
        this.queryParamsOverride = true;
        this.shareText =
          "I'm funding clean-up of more than " +
          params.yearlyRate +
          " kgs of plastic waste every year!\n" +
          "Join me and make an impact with www.empower.eco\n" +
          SHARE_TEXT_BASE;
      } else if (params.oneTime) {
        this.queryParamsOverride = true;
        this.shareText =
          "I just funded clean-up of " +
          params.oneTime +
          " kgs of plastic waste!\n" +
          "Join me and make an impact with www.empower.eco\n" +
          SHARE_TEXT_BASE;
      } else {
      }
    });
  }

  shareToFacebook() {
    this.facebookService.loadFacebookSdk().then(() => {
      FB.ui(
        {
          method: "share",
          href: "https://empower.eco",
          quote: this.shareText
        },
        function() {}
      );
    });
  }

  shareToTwitter() {
    window.location.href =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(this.shareText + "\n@empowereco");
  }
}

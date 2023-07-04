import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { MetaTagService } from "../../services/meta-tag.service";

@Component({
  selector: "app-christmas-landing-base",
  template: ""
})
export class ChristmasLandingBaseComponent {
  customAmount = 10;

  constructor(
    private router: Router,
    protected metaTagService: MetaTagService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.metaTagService.updateOgMetaTags(
      "Vær en supernisse i år!",
      "https://empower.eco/assets/christmas-gift-share-picture.jpg",
      "Gi et gavekort til jul som rydder plastsøppel"
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      (document.getElementsByTagName("body")[0] as any).style[
        "background-color"
      ] = "#fff";
      (document.getElementsByTagName("app-header")[0] as any).style.display =
        "none";
      (document.getElementsByTagName("app-footer")[0] as any).style.display =
        "none";
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      (document.getElementsByTagName("body")[0] as any).style[
        "background-color"
      ] = "#B9E0DE";
      (document.getElementsByTagName("app-header")[0] as any).style.display =
        "";
      (document.getElementsByTagName("app-footer")[0] as any).style.display =
        "";
    }
  }

  increase() {
    this.customAmount += 5;
  }

  decrease() {
    if (this.customAmount > 5) {
      this.customAmount -= 5;
    }
  }

  selectChristmasCard30() {
    this.checkout(30);
  }

  selectChristmasCard60() {
    this.checkout(60);
  }

  selectChristmasCardCustom() {
    this.checkout(this.customAmount);
  }

  private checkout(amount) {
    const data = {
      type: "onetime",
      amount,
      isGift: true,
      campaign: "christmas"
    };

    this.router.navigateByData({
      url: ["checkout"],
      data
    });
  }
}

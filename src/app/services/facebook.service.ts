import { Injectable } from "@angular/core";
import { ScriptServiceService } from "./script-service.service";
declare var FB: any;

@Injectable({
  providedIn: "root"
})
export class FacebookService {
  private facebookLoaded: boolean = false;

  constructor(private scriptService: ScriptServiceService) {}

  async loadFacebookSdk() {
    if (!this.facebookLoaded) {
      await this.scriptService.load("facebooksdk");

      FB.init({
        appId: "611817295858841",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v3.0"
      });

      this.facebookLoaded = true;
    }
  }
}

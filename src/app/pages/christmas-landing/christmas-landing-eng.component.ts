import {
  Component,
} from "@angular/core";
import { ChristmasLandingBaseComponent } from "./christmas-landing-base.component";

@Component({
  selector: "app-christmas-landing",
  templateUrl: "./christmas-landing-eng.component.html",
  styleUrls: ["./christmas-landing.component.scss"]
})
export class ChristmasLandingEngComponent extends ChristmasLandingBaseComponent {
  
  ngOnInit() {
    this.metaTagService.updateOgMetaTags(
      "Be a super santa this year!",
      "https://empower.eco/assets/christmas-gift-share-picture-eng.jpg",
      "Give a gift card for christmas that cleans up plastic waste"
    );
  }

}

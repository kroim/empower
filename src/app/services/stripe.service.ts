import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { ScriptServiceService } from "./script-service.service";

@Injectable({
  providedIn: "root"
})
export class StripeService {
  private stripeLoaded: boolean = false;

  constructor(private scriptService: ScriptServiceService) {}

  async loadStripe() {
    if (!this.stripeLoaded) {
      await this.scriptService.load('stripe');
      const script = document.createElement("script");
      script.innerHTML = `var stripe = Stripe('${environment.stripeKey}');
        var elements = stripe.elements();`;
      document.head.appendChild(script);

      this.stripeLoaded = true;
    }
  }
}

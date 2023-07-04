import { browser, by, element } from "protractor";

export class StripePage {
  getStripeRadioSelector() {
    return element(
      by.css(
        "body > app-root > div > div > app-checkout > div > div > div:nth-child(4) > div > div:nth-child(2) > div > div.form-group > label:nth-child(5) > i"
      )
    );
  }

  getStripeIframe() {
    var driver = browser.driver;
    var loc = by.tagName("iframe");
    return driver.findElement(loc);
  }

  getStripeCardNumberField() {
    return element(by.css("input[name=cardnumber]"));
  }

  getStripeExpDateField() {
    return element(by.css("input[name=exp-date]"));
  }

  getStripeCVVField() {
    return element(by.css("input[name=cvc]"));
  }

  getStripePostalCodeField() {
    return element(by.css("input[name=postal]"));
  }
}

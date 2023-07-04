import { browser, by, element } from "protractor";

export class CoingatePage {
  getCoingateRadioSelector() {
    return element(
      by.css(
        " body > app-root > div > div > app-checkout > div > div > div:nth-child(4) > div > div:nth-child(2) > div > div.form-group > label:nth-child(1) > i"
      )
    );
  }

  getCoingateEmailField() {
    return browser.driver.findElement(
      by.css(
        "#payment-new > div:nth-child(1) > div > div > div.ant-form-item-control-wrapper > div > span > span > input"
      )
    );
  }

  getBitcoinBlock() {
    return browser.driver.findElement(
      by.css(
        "#payment-new > div:nth-child(4) > div > div > div:nth-child(1) > div > div"
      )
    );
  }

  getCoingateMarkAsPaidBtn() {
    return browser.driver.findElement(
      by.css("#payment-button > div > div:nth-child(1) > button")
    );
  }

  getCoingateBackToMerchantBtn() {
    return browser.driver.findElement(
      by.css(
        "#invoice > div.mt-10.buttons > div > div.pull-left > span > button"
      )
    );
  }
}

import { browser, by, element } from "protractor";

export class AppPage {
  navigateToHomePage() {
    return browser.get("/");
  }

  navigateToRegistrationPage() {
    return browser.get("/register");
  }

  navigateToLoginPage() {
    return browser.get("/login");
  }

  navigateToMyPage() {
    return browser.get("/my-page");
  }

  getHelpNowText() {
    return element(by.css(".sponsor-header")).getText();
  }

  getLoginEmailField() {
    return element(by.css("input[name=email]"));
  }

  getLoginPasswordField() {
    return element(by.css("input[name=password]"));
  }

  getRegistrationEmailField() {
    return element(by.css("input[name=email]"));
  }

  getRegistrationPasswordField() {
    return element(by.css("input[name=password]"));
  }

  getLoginButton() {
    return element(by.css(".login-button"));
  }

  getLogoutButton() {
    return element(by.css(".logout-button"));
  }

  getRegisterButton() {
    return element(by.css(".register-button"));
  }

  getConfirmButtonText() {
    return element(by.css(".confirm-button")).getText();
  }

  getConfirmButton() {
    return element(by.css(".confirm-button"));
  }

  getConfirmCodeInput() {
    return element(by.css("app-confirm > div > input"));
  }

  getOneTimeRadioButton5USD() {
    return element(by.css("#onetime_5_i"));
  }

  getSubmitSubscriptionFormButton() {
    return element
      .all(by.css("#help-now > div.go-button-wrapper > button"))
      .get(0);
  }

  getCheckoutHeaderText() {
    return element(by.css(".checkout-header")).getText();
  }

  getSelectedProductText() {
    return element(
      by.css(
        "body > app-root > div > div > app-checkout > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1)"
      )
    ).getText();
  }

  getSelectedProductAmount() {
    return element(
      by.css(
        "body > app-root > div > div > app-checkout > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2)"
      )
    ).getText();
  }

  getPaypalRadioSelector() {
    return element(
      by.css(
        "body > app-root > div > div > app-checkout > div > div > div:nth-child(4) > div > div:nth-child(2) > div > div.form-group > label:nth-child(3) > i"
      )
    );
  }

  getCheckoutPageFirstnameInput() {
    return element(
      by.css(
        "app-checkout > div > div > div.container > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > input"
      )
    );
  }

  getCheckoutPagelastnameInput() {
    return element(
      by.css(
        "body > app-root > div > div > app-checkout > div > div > div.container > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > input"
      )
    );
  }

  getCheckoutPageCountryInput() {
    return element(by.css("select"))
      .all(by.tagName("option"))
      .get(2);
  }

  getPurchaseButton() {
    return element(by.css(".purchase-container > button"));
  }

  getLastlinkText() {
    return element(by.css("#header-nav > a:nth-child(6)")).getText();
  }

  getValidationErrorCount() {
    return element
      .all(by.css("app-checkout > div > div > div.validation-error ul li"))
      .count();
  }

  getPayWithDebitCardButton() {
    return browser.driver.findElement(by.id("createAccount"));
  }

  getPaypalEmailField() {
    return browser.driver.findElement(by.id("email"));
  }

  getPaypalNextButton() {
    return browser.driver.findElement(by.id("btnNext"));
  }

  getPaypalPasswordField() {
    return browser.driver.findElement(by.id("password"));
  }

  getPaypalPasswordField2() {
    return element(by.css("#login_password"));
  }

  getPaypalLoginBtn2() {
    return browser.driver.findElement(by.id("submitLogin"));
  }

  getPaypalLoginBtn() {
    return browser.driver.findElement(by.id("btnLogin"));
  }

  getPaypalConfimrPaymentBtn() {
    return element(by.css("#confirmButtonTop"));
  }

  getPaypalConfirmPatmentbtn2() {
    return browser.driver.findElement(by.id("continue"));
  }

  getChecoutDoneHeader() {
    return element(by.css(".checkout-done-header div"));
  }

  getLastEmail(time) {
    var deferred = protractor.promise.defer();
    console.log("Waiting for an email...");

    mailListener.on("mail", function(mail) {
      var receivedAt = new Date(mail.receivedDate).getTime();
      if (receivedAt > time) deferred.fulfill(mail);
    });
    return deferred.promise;
  }

  getConfirmationCodeFromString(str) {
    const regex = /\<code\>(.*?)\<\/code\>/gm;
    var code, m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
        code = match;
      });
    }

    return code;
  }

  wait(time) {
    browser.driver.sleep(time);
    browser.waitForAngular();
  }
}

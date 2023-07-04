import { AppPage } from "./app.po";
import { StripePage } from "./stripe.po";
import { browser, by, element, protractor } from "protractor";

describe("Stripe", () => {
  let page: AppPage;
  let stripePage: StripePage;

  beforeEach(() => {
    page = new AppPage();
    stripePage = new StripePage();
  });

  it("should create stripe onetime order", done => {
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);

    page.navigateToHomePage();
    page.wait(1000);

    page.getOneTimeRadioButton5USD().click();
    page.getSubmitSubscriptionFormButton().click();

    page.wait(1000);

    expect(page.getCheckoutHeaderText()).toEqual("Checkout");
    expect(page.getSelectedProductText()).toEqual(
      "Empower One-Time Sponsorship"
    );
    expect(page.getSelectedProductAmount()).toEqual("$ 5");

    //login
    page.getLoginButton().click();
    page.getLoginEmailField().sendKeys("formreportautomation@gmail.com");
    page.getLoginPasswordField().sendKeys("apurv");
    page.getLoginButton().click();

    page.wait(2000);

    expect(page.getLastlinkText()).toEqual("My Page");

    expect(browser.getCurrentUrl()).toContain("checkout");

    stripePage.getStripeRadioSelector().click();
    page.wait(2000);

    //

    browser.switchTo().frame(stripePage.getStripeIframe());

    stripePage.getStripeCardNumberField().sendKeys("4242 4242 4242 4242");
    stripePage.getStripeExpDateField().sendKeys("12 / 25");
    stripePage.getStripeCVVField().sendKeys("123");
    stripePage.getStripePostalCodeField().sendKeys("390022");

    browser.switchTo().defaultContent();
    browser.waitForAngular();

    page.wait(500);
    page.getPurchaseButton().click();

    page.getValidationErrorCount().then(function(count) {
      if (count > 0) {
        page.getCheckoutPageFirstnameInput().sendKeys("Apurv");
        page.getCheckoutPagelastnameInput().sendKeys("Suthar");
        page.getCheckoutPageCountryInput().click();
        page.getPurchaseButton().click();
      }
      page.wait(15000);

      expect(page.getChecoutDoneHeader().getText()).toContain("Thank you");

      done();
    });
  });
});

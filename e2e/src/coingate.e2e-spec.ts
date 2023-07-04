import { AppPage } from "./app.po";
import { CoingatePage } from "./coingate.po";
import { browser, by, element, protractor } from "protractor";

describe("Coingate", () => {
  let page: AppPage;
  let coingatePage: CoingatePage;

  beforeEach(() => {
    page = new AppPage();
    coingatePage = new CoingatePage();
  });

  it("should create coingate onetime order", done => {
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

    coingatePage.getCoingateRadioSelector().click();

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

      coingatePage.getCoingateEmailField().sendKeys("contact@collonmade.com");
      coingatePage.getBitcoinBlock().click();
      page.wait(10000);
      coingatePage.getCoingateMarkAsPaidBtn().click();
      page.wait(15000);
      coingatePage.getCoingateBackToMerchantBtn().click();
      page.wait(15000);

      browser.ignoreSynchronization = false;
      browser.waitForAngularEnabled(true);

      expect(page.getChecoutDoneHeader().getText()).toContain("Thank you");

      done();
    });
  });
});

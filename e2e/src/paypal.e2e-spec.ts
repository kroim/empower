import { AppPage } from "./app.po";
import { browser, by, element, protractor } from "protractor";

describe("Paypal", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("home page should have sponsor form", () => {
    page.navigateToHomePage();
    expect(page.getHelpNowText()).toEqual("Sponsor");
  });

  it("should create paypal onetime order", done => {
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

    page.getPaypalRadioSelector().click();

    page.wait(500);
    page.getPurchaseButton().click();

    page.getValidationErrorCount().then(function(count) {
      if (count > 0) {
        page.getCheckoutPageFirstnameInput().sendKeys("Apurv");
        page.getCheckoutPagelastnameInput().sendKeys("Suthar");
        page.getCheckoutPageCountryInput().click();
        page.getPurchaseButton().click();
      }
      page.wait(5000);

      page.getPaypalEmailField().sendKeys("contact@collonmade.com");
      page.getPaypalNextButton().click();
      page.wait(3000);
      page.getPaypalPasswordField().sendKeys("KeyPass123");
      page.getPaypalLoginBtn().click();
      page.wait(15000);

      /*if((page.getPaypalConfimrPaymentBtn()).isPresent()){
	    	console.log('confirm btn found')
	    	page.getPaypalConfimrPaymentBtn().click();
	    	page.wait(15000);
	    }


	    if((page.getPaypalPasswordField2()).isPresent()){
		   	page.getPaypalPasswordField2().sendKeys('KeyPass123');
		    page.getPaypalLoginBtn2().click();
		    page.wait(15000);	
		    page.getPaypalConfirmPatmentbtn2().click(); 
		}*/

      page.getPaypalPasswordField2().sendKeys("KeyPass123");
      page.getPaypalLoginBtn2().click();
      page.wait(15000);
      page.getPaypalConfirmPatmentbtn2().click();

      page.wait(15000);

      browser.ignoreSynchronization = false;
      browser.waitForAngularEnabled(true);

      expect(page.getChecoutDoneHeader().getText()).toContain("Thank you");
      console.log("WORKED!!");

      done();
      //page.getPayWithDebitCardButton().click();
    });
  });
});

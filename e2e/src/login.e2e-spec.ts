import { AppPage } from "./app.po";
import { browser, by, element, protractor } from "protractor";

describe("Login", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("home page should have sponsor form", () => {
    page.navigateToHomePage();
    expect(page.getHelpNowText()).toEqual("Sponsor");
  });

  it("should create new user", done => {
    page.navigateToRegistrationPage();
    page.wait(2000);

    page.getRegistrationEmailField().sendKeys("formreportautomation@gmail.com");
    page.getRegistrationPasswordField().sendKeys("apurv");

    page.getRegisterButton().click();

    var emailDate = new Date().getTime();
    page.wait(2000);

    expect(page.getConfirmButtonText()).toEqual("Confirm Email");

    page.getLastEmail(emailDate).then(function(email) {
      var receivedAt = new Date(email.receivedDate).getTime();
      var code = page.getConfirmationCodeFromString(email.html);
      console.log("CODE = " + code);

      page.getConfirmCodeInput().sendKeys(code);
      page.getConfirmButton().click();
      page.wait(2000);

      expect(page.getLoginButton()).toBeDefined(); //after confirmation redirects to login page
      done();
    });
  });

  it("should login user", () => {
    page.navigateToLoginPage();
    page.wait(2000);

    page.getLoginEmailField().sendKeys("formreportautomation@gmail.com");
    page.getLoginPasswordField().sendKeys("apurv");
    page.wait(2000);

    page.getLoginButton().click();
    page.wait(2000);

    expect(browser.getCurrentUrl()).toContain("my-page");
    var lastLinkText = page.getLastlinkText();
  });

  it("should logout user", () => {
    page.navigateToMyPage();
    page.wait(2000);

    page.getLogoutButton().click();
    page.wait(1000);

    expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/");
  });
});

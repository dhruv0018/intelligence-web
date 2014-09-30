var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Account = require("../../helper/account");

module.exports = function() {
    var account = new Account();

    this.When(/^I visit a restricted page$/, function (callback) {

        this.visitRelative("users");
        
        callback();
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (relativeUrl, callback) {

        this.visitRelative(relativeUrl);

        callback();
    });

    this.Given(/^I am a "([^"]*)"$/, function (User, callback) {
        this.user = User;
        var email = account.getEmail(User);
        account.enterEmail(email);

        callback();
    });

    this.When(/^I authenticate with valid credentials$/, function (callback) {
        var password = account.getPassword(this.user)
        account.enterPassword(password);
        account.clickSignin();

        callback();
    });

    this.Then(/^I should be shown the "([^"]*)" page$/, function (relativeUrl, callback) {

        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });

    this.When(/^I authenticate with an invalid password$/, function (callback) {

        account.enterPassword("invalidPassword");
        account.clickSignin();

        callback();
    });

    this.Given(/^I sign out$/, function (callback) {
        account.signout(callback);
    });

    // this.Given(/^I have gone to the Home Page "([^"]*)" and I'm not Signed In$/, function (relativeUrl, callback) {

    //     browser.get(browser.baseUrl + relativeUrl);
    //     callback();
    // });

    // this.When(/^I enter my correct email address "([^"]*)"$/, function (email, callback) {
        
    //     var emailAddressField = element(by.model("$parent.login.email"));
    //     emailAddressField.sendKeys(email);
    //     callback();
    // });

    // this.When(/^I enter my correct password "([^"]*)"$/, function (password, callback) {
        
    //     var emailPassField = element(by.model("$parent.login.password"));
    //     emailPassField.sendKeys(password);
    //     callback();
    // });

    // this.When(/^I press the 'Sign\-In' button$/, function (callback) {
        
    //     var signUpBtn = element(by.css(".button-signin"));
    //     signUpBtn.click();
    //     callback();
    // });

    // this.Then(/^I should see the page "([^"]*)"$/, function (relativeUrl, callback) {
        
    //     expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    // });

    // this.When(/^I enter an incorrect password "([^"]*)"$/, function (password, callback) {
    //       //     var emailPassField = element(by.model("$parent.login.password"));
    //     emailPassField.sendKeys(password);
    //     callback();
    // });

    // this.Then(/^I should see "([^"]*)" below the password field$/, function (resText, callback) {
    //     var passwordResetLabel = element(by.css(".password-reset a"));
    //     expect(passwordResetLabel.getText()).to.eventually.equal(resText).and.notify(callback);
    // });

};


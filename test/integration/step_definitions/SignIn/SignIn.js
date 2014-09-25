var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {

    this.Given(/^I have gone to the Home Page "([^"]*)" and I'm not Signed In$/, function (relativeUrl, callback) {
        
        browser.get(browser.baseUrl + relativeUrl);
        callback();
    });

    this.When(/^I enter my correct email address "([^"]*)"$/, function (email, callback) {
        
        var emailAddressField = element(by.model("$parent.login.email"));
        emailAddressField.sendKeys(email);
        callback();
    });

    this.When(/^I enter my correct password "([^"]*)"$/, function (password, callback) {
        
        var emailPassField = element(by.model("$parent.login.password"));
        emailPassField.sendKeys(password);
        callback();
    });

    this.When(/^I press 'Sign In'$/, function (callback) {
        
        var signUpBtn = element(by.css(".button-signin"));
        signUpBtn.click();
        callback();
    });

    this.Then(/^I should see the page "([^"]*)"$/, function (relativeUrl, callback) {
        
        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });
};


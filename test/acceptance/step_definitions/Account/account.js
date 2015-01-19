var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Account = require("../../helper/account");

module.exports = function() {
    var account = new Account();

    // this.Given(/^I am logged in as an Admin$/, function (callback) {
    //     account.signin("ADMIN").then(function() {
    //         console.log("signing in");
    //     });
    //     expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + "users").and.notify(function() {
    //         console.log("On the USERS page");
    //         callback();
    //     });
    //     // callback();
    // });

    this.When(/^I visit a restricted page$/, function (callback) {

        this.visitRelative("users");

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

    this.When(/^I authenticate with an invalid password$/, function (callback) {

        account.enterPassword("invalidPassword");
        account.clickSignin();

        callback();
    });

    this.Given(/^I sign out$/, function (callback) {

        account.signout();

        callback();
    });

};


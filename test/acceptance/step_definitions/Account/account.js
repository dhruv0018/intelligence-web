var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var bcrypt = require("../../helper/bcrypt");
var Account = require("../../helper/account");
var Sequelize = require('sequelize');
var sequelize = new Sequelize('intelligence', 'krossover', 'intelligence');

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

    this.Given(/^There is a "([^"]*)"$/, function(userType, done) {

        var User = sequelize.define('user', {
            email: Sequelize.STRING,
            password: Sequelize.STRING
        }, {
            createdAt: false,
            updatedAt: false
        });

        sequelize.sync().then(function() {

            var user = account.getUser(userType);

            User.upsert({
                email: user.email,
                password: bcrypt.hash_password(user.password)
            })
            .then(function() {
                done();
            });
        })
    });

    this.When(/^I visit a restricted page$/, function (callback) {

        this.visitRelative("users");

        callback();
    });

    this.Given(/^I am a "([^"]*)"$/, function (userType, done) {

        var email = account.getEmail(userType);

        this.userType = userType;

        account.enterEmail(email);

        done();
    });

    this.When(/^I authenticate with valid credentials$/, function (done) {

        var password = account.getPassword(this.userType)

        account.enterPassword(password);
        account.clickSignin();

        done();
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

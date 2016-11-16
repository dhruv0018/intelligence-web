var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('./view');

module.exports = function Account() {

    var users = {
        'SUPER_ADMIN': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'ADMIN': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'COACH': {
            email: "andrew@krossover.com",
            password: "Popcorn23",
        },
        'HEAD_COACH': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'ASSISTANT_COACH': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'INDEXER': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'PARENT': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
        'ATHLETE': {
            email: "superadmin@krossover.com",
            password: "superadmin",
        }
    };

    // Assumes that the user is currently logged in
    this.signout = function() {
        // browser.ignoreSynchronization = false;
        element(by.css(".role-dropdown .dropdown-toggle")).click();
        return element.all(by.css(".role-dropdown .dropdown-menu footer button")).get(1).click();
    };

    this.signin = function(userType) {

        browser.get(browser.baseUrl + "login");

        var email = this.getEmail(userType);
        this.enterEmail(email);

        var password = this.getPassword(userType)
        this.enterPassword(password);
        this.clickSignin();

        // Confirm signin by waiting for rolebar to be present.
        return browser.driver.wait(
            function() { return browser.isElementPresent(by.css(".rolebar")); }
        , 10000);

    };

    this.enterEmail = function(email) {
        var emailAddressField = element(by.model("$parent.login.email"));
        emailAddressField.sendKeys(email);
    };

    // Assumes you are on the login page
    this.enterPassword = function(password) {
        var emailPassField = element(by.model("$parent.login.password"));
        emailPassField.sendKeys(password);
    };

    this.clickSignin = function() {
        var signUpBtn = element(by.css(".button-signin"));
        view.scrollIntoView(signUpBtn);
        return signUpBtn.click();
    };

    this.getUser = function(userType) {
        return users[userType];
    };

    this.getEmail = function(userType) {
        // if (users[userType].email
        return users[userType].email;
    };

    this.getPassword = function(userType) {
        return users[userType].password;
    };

    this.getUserTypes = function() {
        var userTypes = [];
        for (var user in users) {
            userTypes.push(user);
        };

        return userTypes;
    }

};

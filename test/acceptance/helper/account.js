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
        'BASKETBALL_COACH': {
            email: "sales@krossover.com",
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
        'FILM_EXCHANGE_ADMIN': {
            email: "jared@krossover.com",
            password: "Popcorn23",
        },
        'ATHLETE': {
            email: "jared@krossover.com",
            password: "Popcorn23",
        },
        'NORTHWESTERNWTEST_COACH' : {
            email: "test+IGTestUser@krossover.com",
            password: "Krossoverpopcorn23",
        },
        'INDIABASKETBALL_COACH' : {
            email: "jared@krossover.com",
            password: "Popcorn23",
        },
        'LACROSSE_COACH' : {
            email: "test+IGTestUser@krossover.com",
            password: "Krossoverpopcorn23",
        }

    };

    this.emailAddressField = element(by.model("$parent.login.email"));
    this.emailPassField = element(by.model("$parent.login.password"));
    this.signUpBtn = element(by.css(".button-signin"));

    // Assumes that the user is currently logged in
    this.signout = function() {
        // browser.ignoreSynchronization = false;
        element(by.css(".role-dropdown .dropdown-toggle")).click();
        return element.all(by.css(".role-dropdown .dropdown-menu footer button")).get(1).click();
    };

    this.enterEmail = function(email) {
        this.emailAddressField.sendKeys(email);
    };

    // Assumes you are on the login page
    this.enterPassword = function(password) {
        this.emailPassField.sendKeys(password);
    };

    this.clickSignin = function() {
        view.scrollIntoView(this.signUpBtn);
        return this.signUpBtn.click();
    };

    this.getUser = function(userType) {
        return users[userType];
    };

    this.getEmail = function(userType) {
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

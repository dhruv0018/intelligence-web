
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
            email: "superadmin@krossover.com",
            password: "superadmin",
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
    
        var roleDropdownButton = by.css(".role-dropdown");
        var roleLogoutButton = by.css(".role-dropdown .dropdown-menu footer button");
        
        element(roleDropdownButton).click();
        element.all(roleLogoutButton).get(1).click();

    };

    this.signin = function(userType) {

        browser.get(browser.baseUrl + "login");

        var email = this.getEmail(userType);
        this.enterEmail(email);

        var password = this.getPassword(userType)
        this.enterPassword(password);
        this.clickSignin();

        // Need to wait to be redirected where .rolebar is expected
        return browser.driver.wait(function() {
            console.log("Confirm signin by waiting for rolebar to be present.");
            return browser.isElementPresent(by.css(".rolebar"));
        });

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
        return signUpBtn.click();
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
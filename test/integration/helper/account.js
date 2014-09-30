
module.exports = function Account() {

    var users = {
        "Admin": {
            email: "superadmin@krossover.com",
            password: "superadmin",
        },
    };

    this.signout = function(callback) {
        element(by.css(".role-dropdown button")).click();
        element.all(by.css(".role-dropdown .dropdown-menu footer button")).get(1).click(); // second element
        callback();
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
        signUpBtn.click();
    };

    this.getEmail = function(userType) {
        return users[userType].email;
    };

    this.getPassword = function(userType) {
      return users[userType].password;  
    };

};
var Account = require("../helper/account");

var myAfterHooks = function () {
    var self = this;
    var account = new Account();
    var userTypes = account.getUserTypes();

    self.After("@logout", function(callback) {
        account.signout();
        callback();
    });
            
    userTypes.forEach(function(userType) {

        self.After( "@" + userType, function(callback) {
            console.log("signout");
            account.signout();
        });

    });

};

module.exports = myAfterHooks;

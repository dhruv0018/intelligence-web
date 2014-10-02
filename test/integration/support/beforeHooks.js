var Account = require("../helper/account");

var myBeforeHooks = function() {
    var self = this;
    var account = new Account();
    var userTypes = account.getUserTypes();

    userTypes.forEach(function(userType) {
    
        self.Before( "@" + userType, function(callback) {
            console.log("signin");
            account.signin(userType).
                then(function() {
                    console.log("logged in");
                    callback();
                });
                // then(callback);
        });

    });
};

module.exports = myBeforeHooks;
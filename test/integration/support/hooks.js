var Account = require("../helper/account");

var myAfterHooks = function () {

    this.After("@logout", function(callback) {
        var account = new Account();
        account.signout(callback);
    });

}

module.exports = myAfterHooks;
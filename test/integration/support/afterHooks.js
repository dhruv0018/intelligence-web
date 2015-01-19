var Account = require("../helper/account");

var myAfterHooks = function () {
    var self = this;
    var account = new Account();
    var userTypes = account.getUserTypes();
            
    userTypes.forEach(function(userType) {

        // self.After( "@" + userType, function(callback) {
        //     console.log("signout");
        //     // browser.ignoreSynchronization = true;
        //     account.signout().
        //         then(function() {
        //             console.log("Signed out");
                    
        //             callback();
        //         });
        // });

    });

    this.After(function after(callback) {

        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');

        callback();
    });
};

module.exports = myAfterHooks;

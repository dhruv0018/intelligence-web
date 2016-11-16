var Account = require("../helper/account");

var myBeforeHooks = function() {
    var self = this;
    var account = new Account();
    var userTypes = account.getUserTypes();

    userTypes.forEach(function(userType) {

        // self.Before( "@" + userType, function(callback) {
        //     console.log("Signin", userType);
        //
        //     account.signin(userType).
        //         then(function() {
        //             console.log("Signed in");
        //             callback();
        //         });
        //
        // });

    });

    self.BeforeFeature(function(event, callback){
        // var feature = event.getPayloadItem('feature');
        // console.log('print out feature name:', feature.getName());
        callback();
    });


};

module.exports = myBeforeHooks;

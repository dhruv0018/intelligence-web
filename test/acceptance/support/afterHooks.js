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

    // this execute after each scenario
    // self.After(function after(event, callback) {
    //     // callback();
    // });

    //this execut after each feature
    self.AfterFeature(function(event, callback){
        var feature = event.getPayloadItem('feature');
        //feature.getName(), feature.getTags(), hook with feature by name or tag
        var tags = feature.getTags();
        if(tags.length > 0 && tags[0].getName() == '@feature1'){
            console.log('@feature1 tag');
        }
        //this starts a new session
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        callback();
    });

    //this execute after scenrio with certain tag
    self.After('@clearStorage', function after(event, callback){
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        console.log('cleared localStorage');
        callback();
    });

    //this execute after scenrio with certain tag
    self.After('@waitForProcess', function after(event, callback){
        browser.manage().timeouts().implicitlyWait(30000);
        callback();
    });
};

module.exports = myAfterHooks;

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {

    this.Then(/^I should be shown the "([^"]*)" page$/, function (relativeUrl, callback) {
        // return browser.driver.wait(
        //     function() { return browser.isElementPresent(by.css(".rolebar")); }
        // , 10000);
        browser.getLocationAbsUrl().then(function(url) {console.log("URL", url);})
        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (relativeUrl, callback) {
        
        browser.ignoreSynchronization = true;

        this.visitRelative(relativeUrl).then(function() {
            console.log("Navigated to ", relativeUrl);
            browser.ignoreSynchronization = false;
            callback();       
        });

        
    });

};
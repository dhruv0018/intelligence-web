var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {

    this.Then(/^I should be shown the "([^"]*)" page$/, function (relativeUrl, callback) {
        console.log("I should be shown the ", relativeUrl);
        // browser.getLocationAbsUrl().then(function(res) {console.log("res url", res);})
        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (relativeUrl, callback) {
        console.log("I navigate to ", relativeUrl);
        this.visitRelative(relativeUrl).then(function() {console.log("navigated to", relativeUrl);callback();});
        
    });

};
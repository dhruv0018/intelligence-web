var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {

    this.Then(/^I should be shown the "([^"]*)" page$/, function (relativeUrl, callback) {

        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (relativeUrl, callback) {

        this.visitRelative(relativeUrl);

        callback();
    });

};
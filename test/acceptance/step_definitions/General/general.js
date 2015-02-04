var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {

    this.Given(/^I navigate to the "([^"]*)" page$/, function(relativeUrl, done) {

        browser.get(relativeUrl).then(done);
    });

    this.Then(/^I should see the "([^"]*)" page$/, function(pageName, done) {

        expect(this.urlContains(pageName)).to.eventually.be.true.and.notify(done);
    });
};


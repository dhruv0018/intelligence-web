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

    this.When(/^I click on "([^"]*)"$/, function(text, done){
        element(by.xpath('.//*[normalize-space(text())="' + text + '"]')).click().then(
            function(){
                // console.log('done click');
                done();
            }
        );
    });

    this.When(/^I pause$/, function(done) {
        browser.pause();
        // browser.debugger();
        // browser.wait(function(){
        //     console.log('finished pausing');
        //     done();
        // }, 10);
    });
};

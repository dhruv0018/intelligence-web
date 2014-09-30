var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {
    
    this.Then(/^I should see no console errors$/, function (callback) {
      
      browser.manage().logs().get('browser').then(function(browserLog) {
            
            var severeErrors = [];
            browserLog.forEach(function(log) {

                if (log.level.name === 'SEVERE') {            
                    severeErrors.push(log);    
                }
            });

            severeErrors.forEach(function(errorLog) {
                console.log("Console Error: ", errorLog.message);
            });

            expect(severeErrors).to.be.empty.notify(callback);
        });
    });

    this.Then(/^I should be shown the "([^"]*)" page$/, function (relativeUrl, callback) {

        expect(browser.getLocationAbsUrl()).to.eventually.equal(browser.baseUrl + relativeUrl).and.notify(callback);
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (relativeUrl, callback) {

        this.visitRelative(relativeUrl);

        callback();
    });

};
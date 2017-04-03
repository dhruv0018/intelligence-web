require('clarify');
require('hide-stack-frames-from')('cucumber');
require('hide-stack-frames-from')('protractor');

module.exports = function() {

    this.World = function World(callback) {

        this.scrollIntoView = function(element) {

            browser.executeScript('arguments[0].scrollIntoView()', element.getWebElement());
        };

        this.visitRelativeUrl = function(relativeUrl) {

            return browser.get(relativeUrl);
        };

        this.waitForUrlChange = function(urlFragment, timeToWaitInMilliseconds) {

            var self = this;

            timeToWaitInMilliseconds = timeToWaitInMilliseconds || 10000;

            return browser.wait(function() {

                return self.urlContains(urlFragment);

            }, timeToWaitInMilliseconds);
        };

        this.urlContains = function(urlFragment) {

            var urlFragmentRegEx = new RegExp(urlFragment, 'i');

            return browser.getCurrentUrl()

            .then(function afterCurrentUrl(url) {
                return urlFragmentRegEx.test(url);
            });
        };

        this.waitForClickable = function(element, timeToWaitInMilliseconds){
            var self = this;
            var EC = protractor.ExpectedConditions;
            var isClickable = EC.elementToBeClickable(element);
            timeToWaitInMilliseconds = timeToWaitInMilliseconds || 45000;
            browser.wait(isClickable, timeToWaitInMilliseconds);
            return element.click();
        };

        this.waitForVisible = function(element, timeToWaitInMilliseconds){
            var self = this;
            var EC = protractor.ExpectedConditions;
            var isVisible = EC.visibilityOf(element);
            timeToWaitInMilliseconds = timeToWaitInMilliseconds || 45000;
            return browser.wait(isVisible, timeToWaitInMilliseconds);
        };

        this.waitForInvisible = function(element, timeToWaitInMilliseconds){
            var self = this;
            var EC = protractor.ExpectedConditions;
            var isInvisible = EC.invisibilityOf(element);
            timeToWaitInMilliseconds = timeToWaitInMilliseconds || 45000;
            browser.wait(isInvisible, timeToWaitInMilliseconds);
        };

        // callback();
    };
}

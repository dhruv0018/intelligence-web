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

        // callback();
    };
}

require('clarify');
require('hide-stack-frames-from')('cucumber');
require('hide-stack-frames-from')('protractor');

module.exports = function() {

    this.World = function World(callback) {

        this.visitRelativeUrl = function(relativeUrl) {

            return browser.get(relativeUrl);
        };

        this.urlContains = function(urlFragment) {

            var urlFragmentRegEx = new RegExp(urlFragment, 'i');

            return browser.getCurrentUrl()

            .then(function afterCurrentUrl(url) {

                return urlFragmentRegEx.test(url);
            });
        };

        callback();
    };
}


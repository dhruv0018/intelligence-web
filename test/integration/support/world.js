
module.exports = function() {
    // var zombie = require('zombie');

    this.World = function World(callback) {
        
        // this.browser = new zombie();
        this.visitRelative = function(relativeUrl) {
            browser.get(browser.baseUrl + relativeUrl);
        };
        callback();
    };
}


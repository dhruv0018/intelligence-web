
exports.scrollIntoView = function(element) {

    browser.executeScript('arguments[0].scrollIntoView()', element.getWebElement());
}


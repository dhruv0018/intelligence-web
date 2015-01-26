/* Fetch angular from the browser scope */
var angular = window.angular;

module.exports = {
    link: require('./link.js'),
    controller: angular.noop,
    template: require('./template.html')
};

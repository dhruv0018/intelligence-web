var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'login',
    'account'
]);

exports = module.exports = IntelligenceWebClient;

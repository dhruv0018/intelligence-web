var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ui.router',
    'ui.bootstrap',
    'login'
]);

exports = module.exports = IntelligenceWebClient;

var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ui.router',
    'ui.bootstrap'
]);

exports = module.exports = IntelligenceWebClient;

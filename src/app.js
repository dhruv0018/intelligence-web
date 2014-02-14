var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngSanitize',
    'ngStorage',
    'ngResource',
    'flow',
    'ui.utils',
    'ui.router',
    'ui.bootstrap',
    'config',
    'login',
    'role',
    'roles',
    'header',
    'alertbar',
    'account',
    'users',
    'teams',
    'schools',
    'leagues',
    'indexer',
    'coach'
]);

exports = module.exports = IntelligenceWebClient;

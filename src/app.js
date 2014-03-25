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
    'rolebar',
    'header',
    'alertbar',
    'account',
    'users',
    'teams',
    'schools',
    'queue',
    'leagues',
    'admin',
    'coach',
    'indexer',
    'Indexing',
    'videoplayer'
]);

exports = module.exports = IntelligenceWebClient;

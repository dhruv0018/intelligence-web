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
    'plan',
    'team-info',
    'account',
    'Users',
    'teams',
    'schools',
    'queue',
    'leagues',
    'admin',
    'Coach',
    'indexer',
    'Indexing',
    'videoplayer',
    'profile-placeholder'
]);

exports = module.exports = IntelligenceWebClient;

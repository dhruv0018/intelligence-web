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
    'no-results',
    'admin',
    'Coach',
    'indexer',
    'indexing',
    'videoplayer',
    'sport-placeholder',
    'role-icon',
    'add-player',
    'mascot-placeholder',
    'profile-placeholder'
]);

exports = module.exports = IntelligenceWebClient;

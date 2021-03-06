const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.constant('USER_SCHEMA', require('../../schemas/user.json'));
IntelligenceWebClient.constant('TEAM_SCHEMA', require('../../schemas/team.json'));
IntelligenceWebClient.constant('GAME_SCHEMA', require('../../schemas/game.json'));
IntelligenceWebClient.constant('REEL_SCHEMA', require('../../schemas/reel.json'));
IntelligenceWebClient.constant('LEAGUE_SCHEMA', require('../../schemas/league.json'));
IntelligenceWebClient.constant('SUBSCRIPTION_SCHEMA', require('../../schemas/subscription.json'));

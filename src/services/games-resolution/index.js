const pkg = require('../../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

import $GamesResolutionService from './service.js';

IntelligenceWebClient.factory('GamesResolutionService', $GamesResolutionService);

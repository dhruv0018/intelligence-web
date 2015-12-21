const pkg = require('../../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

import $QueueGamesService from './base-queue.js';

IntelligenceWebClient.factory('QueueGamesService', $QueueGamesService);

const pkg = require('../../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

import $QueueGamesService from './base-queue.js';

console.log('___$QueueGamesService', $QueueGamesService);

IntelligenceWebClient.factory('QueueGamesService', $QueueGamesService);

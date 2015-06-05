import PerformanceTimer from './performance-timer';
import VideoPerformanceTimer from './video-performance-timer';

const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PerformanceTimer', function() {return PerformanceTimer});
IntelligenceWebClient.factory('VideoPerformanceTimer', function() {return VideoPerformanceTimer});

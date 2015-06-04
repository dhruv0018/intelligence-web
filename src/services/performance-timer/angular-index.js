import PerformanceTimer from './performance-timer';
import VideoPerformanceTimer from './video-performance-timer';

const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('PerformanceTimer', PerformanceTimer);
IntelligenceWebClient.service('VideoPerformanceTimer', VideoPerformanceTimer);

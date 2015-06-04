import PerformanceTimer from './performance-timer';
import VideoPerformanceTimer from './video-performance-timer';

/* Fetch angular from the browser scope */
const angular = window.angular;

angular.$provide.service('PerformanceTimer', PerformanceTimer);
angular.$provide.service('VideoPerformanceTimer', VideoPerformanceTimer);

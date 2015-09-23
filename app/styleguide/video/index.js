import StyleguideVideoState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Video
 * @module Video
 */
const StyleguideVideo = angular.module('Styleguide.Video', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideVideo.config(StyleguideVideoState);

export default StyleguideVideo;

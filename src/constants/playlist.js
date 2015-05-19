const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const PLAYLIST_EVENTS = {
    SELECT_PLAY_EVENT: 'SELECT_PLAY_EVENT'
};

IntelligenceWebClient.constant('PLAYLIST_EVENTS', PLAYLIST_EVENTS);

const CUSTOM_TAGS_EVENTS = {
    SAVE: 'SAVE'
};

IntelligenceWebClient.constant('CUSTOM_TAGS_EVENTS', CUSTOM_TAGS_EVENTS);

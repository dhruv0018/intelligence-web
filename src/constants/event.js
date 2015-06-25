var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

const EVENT = {

    PLAYLIST: {
        PLAY: {
            WATCH: 'PLAYLIST_PLAY_WATCH',
            SELECT: 'PLAYLIST_PLAY_SELECT'
        },
        EVENT: {
            SELECT: 'PLAYLIST_EVENT_SELECT',
            CURRENT_CHANGE: 'PLAYLIST_EVENT_CURRENT_CHANGE'
        }
    }
};

IntelligenceWebClient.constant('EVENT', EVENT);

import KrossoverEvent from '../entities/event/index';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module Indexing
 * @name EventManager
 * @type {service}
 */
IntelligenceWebClient.service('EventManager', [
    'EVENT', 'PlaylistEventEmitter', 'TagsetsFactory',
    function service(EVENT, playlistEventEmitter, tagsets) {

        let current;

        Object.defineProperty(this, 'current', {

            get: function() {

                return current;
            },

            set: function(value) {

                if (current === value) return;

                current = value;

                playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, current);
            }
        });

        /* On event select; set the current event to match the selected event. */
        playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.SELECT, event => this.current = event);
    }
]);

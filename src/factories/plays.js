import KrossoverPlay from '../entities/play.js';
import KrossoverPlayDataDependencies from '../entities/playDataDependencies.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('KrossoverPlayDataDependencies', KrossoverPlayDataDependencies);

IntelligenceWebClient.factory('PlaysFactory', [
    '$injector', 'config', '$sce', 'VIDEO_STATUSES', 'PlaysResource', 'BaseFactory', 'TagsetsFactory', 'Utilities', 'CUEPOINT_CONSTANTS', 'KrossoverPlayDataDependencies',
    function($injector, config, $sce, VIDEO_STATUSES, PlaysResource, BaseFactory, tagsets, utils, CUEPOINT_CONSTANTS, KrossoverPlay) {

        var PlaysFactory = {

            PAGE_SIZE: 1000,

            description: 'plays',

            model: 'PlaysResource',

            storage: 'PlaysStorage',

            extend: function (play) {

                angular.extend(play, this);
                play = new KrossoverPlay(play);

                return play;
            },

            unextend: function (play) {

                play = play || this;

                return play.toJSON();
            },

            filterPlays: function(filterId, resources, success, error) {
                var self = this;
                var playIds = [];

                angular.forEach(resources.plays, function(play) {
                    playIds.push(play.id);
                });

                var filter = {
                    plays: {},
                    options: {
                        teamId: resources.teamId,
                        playerId: resources.playerId,
                        customTagId: resources.customTagId
                    }
                };

                filter.plays[resources.game.id] = playIds;

                var newPlayList = new PlaysResource(filter);

                var callback = success || function(plays) {
                    return plays;
                };

                error = error || function() {
                    throw new Error('could not filter plays');
                };

                return newPlayList.$filter({filterId: filterId.filterId}, callback, error);
            },

            load (filter) {

                return tagsets.load().then(() => { return this.baseLoad(filter); });
            },

            /**
             * Gets the video sources for a play.
             * If a play has a clip the clips video transcode profiles are
             * mapped to video sources that can be used in videogular.
             * @returns Array - an array of video sources.
             */
            getVideoSources: function() {

                var self = this;

                /* If there is no clip for the play, return an empty array. */
                if (!self.clip) return [];

                /* Get the video transcode profiles. */
                var profiles = self.clip.videoTranscodeProfiles;

                /* Map the video transcode profiles to video sources. */
                return profiles.map(profileToSource);

                function profileToSource(profile) {

                    /* If the transcode profile is complete. */
                    if (profile.status === VIDEO_STATUSES.COMPLETE.id) {

                        /* Create a video source. */
                        var source = {
                            type: 'video/mp4',
                            src: $sce.trustAsResourceUrl(profile.videoUrl)
                        };

                        return source;
                    }
                }
            },

            // TODO: move to list modelling
            batchSave: function(plays) {
                let model = $injector.get(this.model);
                let parameters = {};

                plays = plays.map(play => {
                    return this.unextend(play);
                });

                let batchUpdate = model.batchUpdate(parameters, plays);

                return  batchUpdate.$promise;
            },

            filterByCustomTags: function(plays, customTagIds) {
                if (!customTagIds || !customTagIds.length) return plays;

                plays = plays.filter(play => {
                    return customTagIds.every(tagId => {
                        return !!~play.customTagIds.indexOf(tagId);
                    });
                });

                return plays;
            },

            /** Gets the events time relative to a play
            * @param {event} event
            * @param [{event}] play The play it's relative to or the thisObject
            */
            getEventsRelativeTime: function (event, play = this) {

                if (angular.isUndefined(play.startTime)) throw new Error('Play parameter is missing startTime');
                if (!event) throw new Error('Missing "event" parameter');
                if (angular.isUndefined(event.time)) throw new Error('event.time is undefined');

                return event.time - play.startTime;
            },

            getEventCuePoints: function() {

                let cuePoints = [];

                if (!this.events) return cuePoints;

                cuePoints = this.events.map(function(event) {
                    return {
                        time: event.time,
                        type: CUEPOINT_CONSTANTS.TYPES.EVENT
                    };
                });

                return cuePoints;
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);

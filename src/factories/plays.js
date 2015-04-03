import KrossoverEvent from '../entities/event.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysFactory', [
    'config', '$sce', 'VIDEO_STATUSES', 'PlaysResource', 'BaseFactory', 'TagsetsFactory', 'Utilities', 'CUEPOINT_TYPES',
    function(config, $sce, VIDEO_STATUSES, PlaysResource, BaseFactory, tagsets, utils, CUEPOINT_TYPES) {

        var PlaysFactory = {

            PAGE_SIZE: 1000,

            description: 'plays',

            model: 'PlaysResource',

            storage: 'PlaysStorage',

            extend: function(play) {

                var self = this;

                angular.extend(play, self);

                play.events = play.events || [];

                play.period = play.period || 0;

                play.indexedScore = play.indexedScore || 0;
                play.opposingIndexedScore = play.opposingIndexedScore || 0;

                /* Indicates if the play has visible events; set by the events. */
                play.hasVisibleEvents = false;

                /* Play possesion; filled in by the events. */
                play.possessionTeamId = play.possessionTeamId || null;

                play.events = play.events.map(constructEvent);

                function constructEvent (event) {

                    let tag = tagsets.getTag(event.tagId);

                    return new KrossoverEvent(event, tag, event.time);
                }

                return play;
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
                        playerId: resources.playerId
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

                return tagsets.load().then(() => { this.baseLoad(filter); });
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
            getEventCuePoints: function() {
                var cuePoints = [];

                if (!this.events) return cuePoints;

                cuePoints = this.events.map(function(event) {
                    return {
                        time: event.time,
                        type: CUEPOINT_TYPES.EVENT
                    };
                });

                return cuePoints;
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);

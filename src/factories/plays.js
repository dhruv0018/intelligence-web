import KrossoverEvent from '../entities/event.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysFactory', [
    '$injector', 'config', '$sce', 'VIDEO_STATUSES', 'PlaysResource', 'BaseFactory', 'TagsetsFactory', 'Utilities',
    function($injector, config, $sce, VIDEO_STATUSES, PlaysResource, BaseFactory, tagsets, utils) {

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

                /* If play has no custom tags, set it to an empty array */
                play.customTagIds = play.customTagIds || [];

                /* Indicates if the play has visible events; set by the events. */
                play.hasVisibleEvents = false;

                /* Play possesion; filled in by the events. */
                play.possessionTeamId = play.possessionTeamId || null;

                play.events = play.events.map(constructEvent);

                function constructEvent (event) {

                    let tag = tagsets.getTag(event.tagId);

                    /* NOTE: Not all browsers support more than 6 decimals for video times */
                    let safeEventTime = utils.getBrowserVideoPlayerSafeTime(event.time);

                    return new KrossoverEvent(event, tag, safeEventTime);
                }

                return play;
            },

            unextend: function(play) {

                var self = this;

                play = play || self;

                var copy = angular.copy(play);

                delete copy.PAGE_SIZE;
                delete copy.description;
                delete copy.model;
                delete copy.storage;

                delete copy.hasVisibleEvents;
                delete copy.isFiltered;

                copy.events = copy.events.map(unextendEvent);

                function unextendEvent (event) {

                    delete event.activeEventVariableIndex;

                    Object.keys(event.variableValues).forEach(key => {

                        let variableValue = event.variableValues[key];

                        event.variableValues[key] = {
                            type: variableValue.type,
                            value: variableValue.value
                        };
                    });

                    return event;
                }

                return copy;
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
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);

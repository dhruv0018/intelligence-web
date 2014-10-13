var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysFactory', [
    'config', '$sce', 'BaseFactory', 'VIDEO_STATUSES', 'PlaysResource',
    function(config, $sce, BaseFactory, VIDEO_STATUSES, PlaysResource) {

        var PlaysFactory = {

            PAGE_SIZE: 1000,

            description: 'plays',

            model: 'PlaysResource',

            storage: 'PlaysStorage',

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
            getVideoSources: function getVideoSources() {

                var self = this;
                var profiles = (self.clip) ? self.clip.videoTranscodeProfiles : [];
                var profile;
                var sources = [];

                var defaultVideo;
                var DEFAULT_VIDEO_ID = config.defaultVideoId;

                if (self.clip && self.clip.status === VIDEO_STATUSES.COMPLETE.id) {
                    profiles.forEach(function(profile) {
                        if (profile.videoUrl) {

                            if (profile.status === VIDEO_STATUSES.COMPLETE.id) {

                                var source = {
                                    type: 'video/mp4',
                                    src: $sce.trustAsResourceUrl(profile.videoUrl)
                                };

                                if (profile.transcodeProfile.id === DEFAULT_VIDEO_ID) {
                                    defaultVideo = source;
                                } else {
                                    sources.push(source);
                                }
                            }

                        }
                    });

                    if (defaultVideo) sources.unshift(defaultVideo);
                }

                return sources;
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);

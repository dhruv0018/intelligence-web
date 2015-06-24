import KrossoverPlay from '../entities/play.js';
import KrossoverPlayDataDependencies from '../entities/playDataDependencies.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysFactory', PlaysFactory);
IntelligenceWebClient.factory('KrossoverPlayDataDependencies', KrossoverPlayDataDependencies);

PlaysFactory.$inject = [
    'KrossoverPlayDataDependencies',
    '$injector',
    'config',
    '$sce',
    'VIDEO_STATUSES',
    'PlaysResource',
    'BaseFactory',
    'TagsetsFactory',
    'Utilities'
];

function PlaysFactory (
    KrossoverPlay,
    $injector,
    config,
    $sce,
    VIDEO_STATUSES,
    PlaysResource,
    BaseFactory,
    tagsets,
    utils
) {

    let factory = {

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

            let self = this;
            let playIds = [];

            angular.forEach(resources.plays, (play) => playIds.push(play.id));

            let filter = {

                plays: {},
                options: {

                    teamId: resources.teamId,
                    playerId: resources.playerId,
                    customTagId: resources.customTagId
                }
            };

            filter.plays[resources.game.id] = playIds;

            let newPlayList = new PlaysResource(filter);

            let callback = success || function (plays) {

                return plays;
            };

            error = error || function () {

                throw new Error('could not filter plays');
            };

            return newPlayList.$filter({filterId: filterId.filterId}, callback, error);
        },

        load (filter) {

            return tagsets.load().then(() => this.baseLoad(filter));
        },

        /**
         * Gets the video sources for a play.
         * If a play has a clip the clips video transcode profiles are
         * mapped to video sources that can be used in videogular.
         * @returns Array - an array of video sources.
         */
        getVideoSources: function () {

            let self = this;

            /* If there is no clip for the play, return an empty array. */
            if (!self.clip) return [];

            /* Get the video transcode profiles. */
            let profiles = self.clip.videoTranscodeProfiles;

            /* Map the video transcode profiles to video sources. */
            return profiles.map(profileToSource);

            function profileToSource (profile) {

                /* If the transcode profile is complete. */
                if (profile.status === VIDEO_STATUSES.COMPLETE.id) {

                    /* Create a video source. */
                    let source = {

                        type: 'video/mp4',
                        src: $sce.trustAsResourceUrl(profile.videoUrl)
                    };

                    return source;
                }
            }
        },

        // TODO: move to list modelling
        batchSave: function (plays) {

            let model = $injector.get(this.model);
            let parameters = {};

            plays = plays.map(play => {

                return this.unextend(play);
            });

            let batchUpdate = model.batchUpdate(parameters, plays);

            return  batchUpdate.$promise;
        },

        filterByCustomTags: function (plays, customTagIds) {

            if (!customTagIds || !customTagIds.length) return plays;

            plays = plays.filter(play => {

                return customTagIds.every(tagId => {

                    return !!~play.customTagIds.indexOf(tagId);
                });
            });

            return plays;
        }
    };

    angular.augment(factory, BaseFactory);

    return factory;
}

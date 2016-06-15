const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const PAGE_SIZE = 500;
const description = 'selfeditedplays';
const model = 'SelfEditedPlaysResource';
const storage = 'SelfEditedPlaysStorage';
const updateLocalResourceOnPUT = true;

/* Self Edited plays factory is a child of plays factory */
IntelligenceWebClient.factory('SelfEditedPlaysFactory', [
    'KrossoverPlayFactory',
    'PlaysFactory',
    function(
        KrossoverPlayFactory,
        PlaysFactory
    ) {

        const SelfEditedPlaysFactory = {

            PAGE_SIZE,

            description,

            model,

            storage,

            updateLocalResourceOnPUT,

            setStartTime: function(startTime) {
                this.startTime = startTime;
            },

            setEndTime: function(endTime) {
                this.endTime = endTime;
            },

            extend: function (play) {

                play = KrossoverPlayFactory.create(play);
                angular.augment(play, this);

                play.isSelfEdited = true;

                return play;
            }

        };

        angular.augment(SelfEditedPlaysFactory, PlaysFactory);

        return SelfEditedPlaysFactory;
    }
]);

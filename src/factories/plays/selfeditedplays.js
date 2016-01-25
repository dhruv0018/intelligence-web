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
    'PlaysFactory',
    function(
        PlaysFactory
    ) {

        const SelfEditedPlaysFactory = {

            PAGE_SIZE,

            description,

            model,

            storage,

            updateLocalResourceOnPUT,

        };

        angular.augment(SelfEditedPlaysFactory, PlaysFactory);

        return SelfEditedPlaysFactory;
    }
]);

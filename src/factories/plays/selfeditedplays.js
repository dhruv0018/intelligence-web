const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const PAGE_SIZE = 1000;
const description = 'selfeditedplays';
const model = 'SelfEditedPlaysResource';
const storage = 'SelfEditedPlaysStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('SelfEditedPlaysFactory', [
    'PlaysFactory',
    function(
        PlaysFactory
    ) {

        var SelfEditedPlaysFactory = {

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

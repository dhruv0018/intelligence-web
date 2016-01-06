const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const PAGE_SIZE = 1000;
const description = 'selfeditedplays';

IntelligenceWebClient.factory('SelfEditedPlaysFactory', [
    'PlaysFactory',
    function(
        PlaysFactory
    ) {

        var SelfEditedPlaysFactory = {

            PAGE_SIZE,

            description,

            model: 'SelfEditedPlaysResource',

            storage: 'SelfEditedPlaysStorage',

            updateLocalResourceOnPUT: true,

        };

        angular.augment(SelfEditedPlaysFactory, PlaysFactory);

        return SelfEditedPlaysFactory;
    }
]);

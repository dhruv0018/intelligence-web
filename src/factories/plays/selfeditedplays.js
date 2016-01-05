const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SelfEditedPlaysFactory', [
    function(

    ) {

        var SelfEditedPlaysFactory = {

            PAGE_SIZE: 1000,

            description: 'selfeditedplays',

            model: 'SelfEditedPlaysResource',

            storage: 'SelfEditedPlaysStorage',

            updateLocalResourceOnPUT: true,

        };

        angular.augment(SelfEditedPlaysFactory, PlaysFactory);

        return SelfEditedPlaysFactory;
    }
]);

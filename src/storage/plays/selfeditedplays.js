const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SelfEditedPlaysStorage', [
    'BaseStorage', 'SelfEditedPlaysFactory',
    function(BaseStorage, plays) {

        let SelfEditedPlaysStorage = Object.create(BaseStorage);

        SelfEditedPlaysStorage.factory = plays;
        SelfEditedPlaysStorage.description = plays.description;

        return SelfEditedPlaysStorage;
    }
]);

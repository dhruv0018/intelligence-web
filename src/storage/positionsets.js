var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PositionsetsStorage', [
    'BaseStorage', 'PositionsetsFactory',
    function(BaseStorage, positionsets) {

        var PositionsetsStorage = Object.create(BaseStorage);

        PositionsetsStorage.description = positionsets.description;

        return PositionsetsStorage;
    }
]);


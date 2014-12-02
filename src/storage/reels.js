var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsStorage', [
    'BaseStorage', 'ReelsFactory',
    function(BaseStorage, reels) {

        var ReelsStorage = Object.create(BaseStorage);

        ReelsStorage.description = reels.description;

        return ReelsStorage;
    }
]);


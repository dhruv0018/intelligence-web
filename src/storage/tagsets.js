var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsStorage', [
    'BaseStorage', 'TagsetsFactory',
    function(BaseStorage, tagsets) {

        var TagsetsStorage = Object.create(BaseStorage);

        TagsetsStorage.description = tagsets.description;

        return TagsetsStorage;
    }
]);


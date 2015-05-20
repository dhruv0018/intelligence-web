const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('CustomtagsStorage', [
    'BaseStorage',
    'CustomtagsFactory',
    function(
        BaseStorage,
        customtags
    ) {

        const CustomtagsStorage = Object.create(BaseStorage);

        CustomtagsStorage.factory = customtags;
        CustomtagsStorage.description = customtags.description;

        return CustomtagsStorage;
    }
]);

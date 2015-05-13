const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('CustomtagsFactory', [
    'BaseFactory',
    function(
        BaseFactory
    ) {

        const CustomtagsFactory = {

            description: 'customtags',

            model: 'CustomtagsResource',

            storage: 'CustomtagsStorage',

        };

        angular.augment(CustomtagsFactory, BaseFactory);

        return CustomtagsFactory;
    }
]);

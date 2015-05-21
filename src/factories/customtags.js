const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('CustomtagsFactory', [
    '$injector',
    '$q',
    'BaseFactory',
    function(
        $injector,
        $q,
        BaseFactory
    ) {

        const CustomtagsFactory = {

            description: 'customtags',

            model: 'CustomtagsResource',

            storage: 'CustomtagsStorage',

            // TODO: move to list modelling
            batchSave: function(customTags) {

                let model = $injector.get(this.model);
                let storage = $injector.get(this.storage);
                let parameters = {};
                let batchUpdate = model.batchUpdate(parameters, customTags);

                return batchUpdate.$promise.then(tags => {
                    return tags.map(tag => {
                        tag = this.extend(tag);
                        storage.set(tag);
                        return tag;
                    });
                });
            }

        };

        angular.augment(CustomtagsFactory, BaseFactory);

        return CustomtagsFactory;
    }
]);

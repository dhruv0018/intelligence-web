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
                let promises = customTags.map(tag => tag.save());


                return $q.all(promises).then(function() {
                    return customTags.map(tag => storage.get(tag.id));
                });

                /* FIXME: use this when batch saving is in back end
                 *let parameters = {};
                 *let batchUpdate = model.batchUpdate(parameters, customTags);
                 *
                 *return  batchUpdate.$promise;
                 */
            }

        };

        angular.augment(CustomtagsFactory, BaseFactory);

        return CustomtagsFactory;
    }
]);

/* Module Imports */
import RevertToIndexingModalController from './controller';

const templateUrl = 'revert-indexing/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * RevertToIndexing Service
 * @module RevertToIndexing
 * @name RevertToIndexing.Service
 * @type {Service}
 */

RevertToIndexingModel.$inject = [
    '$modal',
    'RevertToIndexing.ModalOptions'
];

function RevertToIndexingModel(
    $modal,
    $modalOptions
) {

    const definition = {

        open: function(game) {
            var resolves = {

                resolve: {

                    Game: function() { return game; }
                }
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        },
        setScope: function(scope) {
            $modalOptions.scope = scope;
        }

    };


    return definition;
}

export default RevertToIndexingModel;

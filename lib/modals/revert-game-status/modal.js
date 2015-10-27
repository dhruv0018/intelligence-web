/* Module Imports */
import RevertGameStatusModalController from './controller';

const templateUrl = 'revert-indexing/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * RevertGameStatus Service
 * @module RevertGameStatus
 * @name RevertGameStatus.Service
 * @type {Service}
 */

RevertGameStatusModel.$inject = [
    '$modal',
    'RevertGameStatus.ModalOptions'
];

function RevertGameStatusModel(
    $modal,
    $modalOptions
) {

    const definition = {

        open: function(game, revertToStatus) {
            var resolves = {
                resolve: {
                    Game: () => game,
                    RevertToStatus: () =>  revertToStatus
                }
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        }

    };


    return definition;
}

export default RevertGameStatusModel;

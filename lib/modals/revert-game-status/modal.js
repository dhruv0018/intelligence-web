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
    '$uibModal',
    'RevertGameStatus.ModalOptions'
];

function RevertGameStatusModel(
    $uibModal,
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

            return $uibModal.open(options);
        }

    };


    return definition;
}

export default RevertGameStatusModel;

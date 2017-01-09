const angular = window.angular;

import SelectIndexerController from './controller';

/**
 * SelectIndexer page module.
 * @module SelectIndexer
 */
var SelectIndexer = angular.module('SelectIndexer', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * SelectIndexer Modal
 * @module SelectIndexer
 * @name SelectIndexer.Modal
 * @type {service}
 */
SelectIndexer.value('SelectIndexer.ModalOptions', {

    templateUrl: 'lib/modals/select-indexer/template.html',
    controller: SelectIndexerController
});


/**
 * SelectIndexer modal dialog.
 * @module SelectIndexer
 * @name SelectIndexer.Modal
 * @type {service}
 */
SelectIndexer.service('SelectIndexer.Modal',[
    '$uibModal', 'SelectIndexer.ModalOptions',
    function($uibModal, modalOptions) {

        var Modal = {

            open: function(game, isQa) {

                var resolves = {

                    resolve: {
                        Game: function() { return game; },
                        isQa: function() { return isQa; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

SelectIndexer.controller('SelectIndexer.controller', SelectIndexerController);

export default SelectIndexer;

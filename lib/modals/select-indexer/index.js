/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * SelectIndexer page module.
 * @module SelectIndexer
 */
var SelectIndexer = angular.module('SelectIndexer', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
SelectIndexer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('select-indexer.html', template);
    }
]);

/**
 * SelectIndexer Modal
 * @module SelectIndexer
 * @name SelectIndexer.Modal
 * @type {service}
 */
SelectIndexer.value('SelectIndexer.ModalOptions', {

    templateUrl: 'select-indexer.html',
    controller: 'SelectIndexer.controller'
});


/**
 * SelectIndexer modal dialog.
 * @module SelectIndexer
 * @name SelectIndexer.Modal
 * @type {service}
 */
SelectIndexer.service('SelectIndexer.Modal',[
    '$modal', 'SelectIndexer.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(data, game, isQa) {

                var resolves = {

                    resolve: {

                        Data: function() { return data; },
                        Game: function() { return game; },
                        isQa: function() { return isQa; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * SelectIndexer controller.
 * @module SelectIndexer
 * @name SelectIndexer.controller
 * @type {controller}
 */
SelectIndexer.controller('SelectIndexer.controller', [
    '$scope', '$state', '$modalInstance', 'ROLE_TYPE', 'Data', 'Game', 'isQa',
    function controller($scope, $state, $modalInstance, ROLE_TYPE, data, game, isQa) {

        $scope.ROLE_TYPE = ROLE_TYPE;

        $scope.users = data.users.getList();
        $scope.game = game;
        $scope.isQa = isQa;

        $scope.selectionData = {
            modifiedDeadline: {}
        };

        $scope.assignToIndexer = function(indexerId, deadline) {
            $scope.game.assignToIndexer(indexerId, deadline);
            $scope.game.save();
            $modalInstance.close();
        };

        $scope.assignToQa = function(indexerId, deadline) {

            $scope.game.assignToQa(indexerId, deadline);
            $scope.game.save();
            $modalInstance.close();
        };
    }
]);


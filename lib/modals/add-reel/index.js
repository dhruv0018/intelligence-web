/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AddReel page module.
 * @module AddReel
 */
var AddReel = angular.module('AddReel', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AddReel.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-reel.html', template);
    }
]);

/**
 * AddReel Modal
 * @module AddReel
 * @name AddReel.Modal
 * @type {service}
 */
AddReel.value('AddReel.ModalOptions', {

    templateUrl: 'add-reel.html',
    controller: 'AddReel.controller',
    size: 'sm'
});


/**
 * AddReel modal dialog.
 * @module AddReel
 * @name AddReel.Modal
 * @type {service}
 */
AddReel.service('AddReel.Modal',[
    '$modal', 'AddReel.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(play) {
                var resolves = {

                    resolve: {

                        Play: function() { return play; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

/**
 * AddReel controller.
 * @module AddReel
 * @name AddReel.controller
 * @type {controller}
 */
AddReel.controller('AddReel.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'Play', 'AlertsService',
    function controller($scope, $state, $modalInstance, games, play, alerts) {
        $scope.hasReels = false;
        $scope.isNaming = false;
        $scope.addSuccess = false;
        console.log(play);

        $scope.createReel = function() {

            $scope.addSuccess = true;
        };
    }
]);


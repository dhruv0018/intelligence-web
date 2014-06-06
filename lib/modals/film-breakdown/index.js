/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Breakdown page module.
 * @module Film Breakdown
 */
var FilmBreakdown = angular.module('FilmBreakdown', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
FilmBreakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-breakdown.html', template);
    }
]);

/**
 * Film Breakdown modal dialog.
 * @module Film Breakdown
 * @name FilmBreakdown.Modal
 * @type {value}
 */
FilmBreakdown.value('FilmBreakdown.ModalOptions', {

    templateUrl: 'film-breakdown.html',
    controller: 'FilmBreakdown.controller'
});

/**
 * Film Breakdown modal dialog.
 * @module Film Breakdown
 * @name FilmBreakdown.Modal
 * @type {value}
 */
FilmBreakdown.service('FilmBreakdown.Modal', [
    '$modal', 'FilmBreakdown.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(game) {

                var resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

/**
 * Film Breakdown controller.
 * @module Film Breakdown
 * @name FilmBreakdown.controller
 * @type {controller}
 */
FilmBreakdown.controller('FilmBreakdown.controller', [
    '$scope', '$state', '$modalInstance', 'FilmBreakdown.Modal', 'Game',
    function controller($scope, $state, $modalInstance, modal, game) {

        $scope.sources = game.getVideoSources();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);


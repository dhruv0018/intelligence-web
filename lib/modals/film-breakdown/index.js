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
    controller: 'FilmBreakdown.controller',
    size: 'lg'
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

            open: function(options) {

                options = options || {};
                options.windowClass = 'film-breakdown-size';
                angular.extend(modalOptions, options);

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
    '$scope', '$state', '$modalInstance', 'TeamsFactory',
    function controller($scope, $state, $modalInstance, teams) {

        $scope.sources = $scope.game.getVideoSources();
        $scope.team = teams.get($scope.teamId);
        $scope.opposingTeam = teams.get($scope.opposingTeamId);
    }
]);


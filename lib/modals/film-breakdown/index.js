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

            open: function(resolveOptions) {

                var resolves = {

                    resolve: {

                        Game: function() { return resolveOptions.game; },
                        Plays: function() { return resolveOptions.plays; },
                        Team: function() { return resolveOptions.team; },
                        League: function() { return resolveOptions.league; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);
                options.windowClass = 'film-breakdown-size';

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
    '$scope', '$state', '$modalInstance', 'Game', 'Plays', 'League', 'Team', 'PlayManager',
    function controller($scope, $state, $modalInstance, game, plays, league, team, play) {

        $scope.plays = plays;
        $scope.play = play;
        $scope.league = league;
        $scope.team = team;
        $scope.sources = game.getVideoSources();
    }
]);


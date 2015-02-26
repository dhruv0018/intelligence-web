/* Component dependencies */
require('gap');
require('text');
require('yard');
require('arena');
require('static');
require('dropdown');
require('formation');
require('passing-zone');
require('team-dropdown');
require('player-dropdown');
require('team-player-dropdown');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Item
 * @module Item
 */
var Item = angular.module('Item', [
    'ui.router',
    'ui.bootstrap',
    'Item.Gap',
    'Item.Text',
    'Item.Yard',
    'Item.Arena',
    'Item.Static',
    'Item.Dropdown',
    'Item.Formation',
    'Item.PassingZone',
    'Item.TeamDropdown',
    'Item.PlayerDropdown',
    'Item.TeamPlayerDropdown'
]);

/* Cache the template file */
Item.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('krossoverItem', [
    'ROLES', '$location', '$anchorScroll', 'SessionService', 'GamesFactory',
    function directive(ROLES, $location, $anchorScroll, session, games) {

        var Item = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                play: '=?',
                plays: '=?',
                event: '=',
                league: '=?',
                autoAdvance: '=?'
            },

            controller: koiItemController,

            controllerAs: 'koiItemController',

            templateUrl: templateUrl
        };

        function koiItemController($scope) {
            // By default, plays are not editable.
            $scope.isEditable = false;

            /*
            * EDIT RULES
            * User can edit if they are:
            * - An Indexer
            * - The Game Uploader (a.k.a 'Owner')
            * - A Coach on the uploader's team.
            */

            if ($scope.play) $scope.game = games.get($scope.play.gameId);

            if ($scope.game) {
                var isIndexer = session.currentUser.is(ROLES.INDEXER);
                var isUploader = session.currentUser.id === $scope.game.uploaderUserId;
                $scope.isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;
                var isACoachOfUploadersTeam = session.currentUser.is(ROLES.COACH) && $scope.isTeamMember;

                if (isIndexer || isUploader || isACoachOfUploadersTeam) {
                    $scope.isEditable = true;
                }
            }


            if ($scope.item && $scope.item.id && $scope.event && $scope.event.variableValues) {

                $scope.event.variableValues[$scope.item.id] = $scope.event.variableValues[$scope.item.id] || {};
                $scope.event.variableValues[$scope.item.id].type = $scope.event.variableValues[$scope.item.id].type || null;

                if (angular.isUndefined($scope.event.variableValues[$scope.item.id].value) && !$scope.item.isRequired) {

                    $scope.event.variableValues[$scope.item.id].value = null;
                }
            }

            $scope.isString = function(item) {

                return angular.isString(item);
            };

            /* Watch for variable value changes. */
            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                if (variableValue === previousVariableValue) return;

                if ($scope.autoAdvance) return;

                /* If the variable value has been set. */
                if (variableValue) {

                    /* If the play has been saved before. */
                    if ($scope.play.id) {

                        /* Save the play. */
                        $scope.play.save()

                        .catch(function() {

                            $scope.play.error = true;
                        });
                    }
                }
            });
        }

        return Item;
    }
]);


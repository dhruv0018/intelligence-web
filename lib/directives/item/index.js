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
    'ROLES', '$location', '$anchorScroll', 'SessionService', 'GamesFactory', 'TagsetsFactory',
    function directive(ROLES, $location, $anchorScroll, session, games, tagsets) {


        /**
         * Determines if an item is editable
         * @param {Object} game - a game object
         * @return {Object} boolean - whether or not the item can be edited
         * EDIT RULES
         * User can edit if they are:
         * - An Indexer
         * - The Game Uploader (a.k.a 'Owner')
         * - A Coach on the uploader's team.
         */
        function canItemBeEdited(game) {
            if (!game) return false;

            var isIndexer = session.currentUser.is(ROLES.INDEXER);
            var isUploader = session.currentUser.id === game.uploaderUserId;
            var isTeamMember = session.getCurrentTeamId() === game.uploaderTeamId;
            var isACoachOfUploadersTeam = session.currentUser.is(ROLES.COACH) && isTeamMember;

            return (isIndexer || isUploader || isACoachOfUploadersTeam);
        }

        /**
         * initialized the variable values inside an event -- based on the item id
         * @param {Object} item - an item object
         * @param {Object} event - an event object
         */
        function initializeEventVariableValues(item, event) {
            if (!item || !item.id) return;
            if (!event || !event.variableValues) return;
            event.variableValues[item.id] = event.variableValues[item.id] || {};
            event.variableValues[item.id].type = event.variableValues[item.id].type || null;

            if (angular.isUndefined(event.variableValues[item.id].value) && !item.isRequired) {

                event.variableValues[item.id].value = null;
            }
        }

        /**
         * Determines the appropriate tag to use based on the event and the league
         * @param {Object} event
         * @param {Object} league
         * @returns {Object} tag
         */
        function getTag(event, league) {
            if (!event || !league) return null;
            var tagId = event.tagId;
            var tagsetId = league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.tags;
            var tag = tags[tagId];
            return tag;
        }

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
            $scope.tag = getTag($scope.event, $scope.league);

            if ($scope.play && $scope.play.gameId) {
                $scope.game = games.get($scope.play.gameId);
            }

            // By default, editing an item is restricted
            $scope.isEditable = canItemBeEdited($scope.game);
            initializeEventVariableValues($scope.item, $scope.event);

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


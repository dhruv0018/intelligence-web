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
        var Item = {

            restrict: TO += ELEMENTS,
            controller: 'ItemController',
            controllerAs: 'itemController',
            templateUrl: templateUrl
        };

        return Item;
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('krossoverSummaryItem', [
    'ROLES', '$location', '$anchorScroll', 'SessionService', 'GamesFactory', 'TagsetsFactory',
    function directive(ROLES, $location, $anchorScroll, session, games, tagsets) {
        var Item = {

            restrict: TO += ELEMENTS,
            scope: {
                item: '=',
                play: '=?',
                plays: '=?',
                event: '=',
                league: '=?',
                autoAdvance: '=?',
                game: '=?'
            },
            controller: 'ItemController',

            controllerAs: 'itemSummaryController',

            templateUrl: templateUrl
        };

        return Item;
    }
]);




Item.controller('ItemController', [
    '$scope',
    'ROLES',
    '$location',
    '$anchorScroll',
    'SessionService',
    'GamesFactory',
    'TagsetsFactory',
    'ZONES',
    'ZONE_IDS',
    'GAPS',
    'GAP_IDS',
    function ItemController($scope, ROLES, $location, $anchorScroll, session, games, tagsets, ZONES, ZONE_IDS, GAPS, GAP_IDS) {
        var currentUser = session.currentUser;
        $scope.isCoach = currentUser.is(ROLES.COACH);
        $scope.isIndexer = currentUser.is(ROLES.INDEXER);
        $scope.variable = {
            value: undefined
        };
        $scope.isReset = false;

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

        $scope.isUndefined = function(item) {

            return angular.isUndefined(item);
        };

        $scope.onChange = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index + 1;
            }
        };

        $scope.shouldFocus = function() {
            if ($scope.autoAdvance === true) {
                return $scope.event.activeEventVariableIndex == $scope.item.index;
            } else {
                return $scope.isReset;
            }
        };

        $scope.reset = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
            $scope.event.variableValues[$scope.item.id].value = undefined;
            $scope.isReset = true;
        };

        //todo note that player dropdown select doesnt work correctly without a timeout, however, that causes
        //a plethora of other issues
        $scope.onBlur = function() {
            $scope.isReset = false;

            switch($scope.item.type) {
                //todo imo still needs some cleaning up
                //would be nice to not have cases, but this will clean itself up in classes
                case 'TEXT':
                    if (!$scope.variable.value) {
                        $scope.resetItemValue();
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                    }
                    break;
                default:
                    if (!$scope.event.variableValues[$scope.item.id].value && $scope.isCoach) {
                        $scope.resetItemValue();
                    }
                    break;
            }
        };

        //todo a future item class method
        $scope.resetItemValue = function() {
            console.log('being called');
            $scope.event.variableValues[$scope.item.id].value = ($scope.item.isRequired) ? $scope.previousValue : null;
        };

        /* Watch for variable value changes. */
        $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {
            if (angular.isUndefined(variableValue)) {
                $scope.variable.value = undefined;
            }

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

        //todo more item specific stuff to move into a class
        switch($scope.item.type) {
            //jumps to the next item (aka - tag variable -- which is a form field) after digits have been entered
            case 'YARD':
                $scope.$watch('variable.value', function(value) {

                    if (value && value.length > 1) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                        $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                    }
                });
                break;
            case 'PASSING_ZONE':
                $scope.ZONES = ZONES;
                $scope.ZONE_IDS = ZONE_IDS;
                break;
            case 'GAP':
                $scope.GAPS = GAPS;
                $scope.GAP_IDS = GAP_IDS;
                break;
            case 'DROPDOWN':
                $scope.options = ($scope.item && $scope.item.options) ? JSON.parse($scope.item.options) : [];
        }
    }
]);


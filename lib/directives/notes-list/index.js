/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/notes-list/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * NotesList
 * @module NotesList
 */
var NotesList = angular.module('NotesList', []);

/**
 * NotesList directive.
 * @module NotesList
 * @name NotesList
 * @type {directive}
 */
NotesList.directive('krossoverNotesList', [
    function directive() {

        var NotesList = {

            restrict: TO += ELEMENTS,

            replace: true,

            link: link,

            scope: {
                game: '='
            },

            controller: 'NotesList.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return NotesList;
    }
]);

/**
 * NotesList controller.
 * @module NotesList
 * @name NotesList.controller
 * @type {controller}
 */
NotesList.controller('NotesList.controller', [
    '$scope', 'GAME_NOTE_TYPES',
    function controller($scope, GAME_NOTE_TYPES) {
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;
    }

]);

export default NotesList;

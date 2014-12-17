/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Public Footer
 * @module Public Footer
 */
var publicFooter = angular.module('public-footer', []);

/* Cache the template file */
publicFooter.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('public-footer.html', template);
    }
]);

/**
 * Public Footer directive.
 * @module Public Footer
 * @name Public Footer
 * @type {Directive}
 */
publicFooter.directive('publicFooter', [
    'TeamsFactory', 'GAME_TYPES_IDS', 'GAME_TYPES', 'SessionService', 'AuthorizationService', 'ShareFilm.Modal', 'BasicModals', 'AccountService',
    function directive(teams, GAME_TYPES_IDS, GAME_TYPES, session, auth, ShareFilmModal, modals, account) {

        var publicFooter = {

            restrict: TO += ELEMENTS,

            scope: {

            },

            link: link,

            templateUrl: 'public-footer.html',

        };

        function link($scope, element, attrs) {

        }

        return publicFooter;
    }
]);

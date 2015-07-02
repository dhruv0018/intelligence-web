/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'player-multiselect/template.html';
const multiselectTemplateUrl = 'player-multiselect/multiselect-template.html';

/* Component resources */
const template = require('./template.html');
const multiselectTemplate = require('./multiselect-template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Player Multiselect
 * @module Player Multiselect
 */
const PlayerMultiselect = angular.module('PlayerMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'ui.multiselect'
]);

/* Cache the template file */
PlayerMultiselect.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put(multiselectTemplateUrl, multiselectTemplate);
    }
]);

/**
 * Player Multiselect directive.
 * @module Player Multiselect
 * @name Player Multiselect
 * @type {Directive}
 */
PlayerMultiselect.directive('playerMultiselect', [
    function directive() {

        const playerMultiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                players: '=',
                selectedPlayerIds: '=ngModel'
            },

            link: link
        };

        function link($scope, element, attributes) {

            // //Sort player alphabetically
            // $scope.$watch('players', () => {
            //     $scope.players.sort( (a, b) => {
            //         return a.name.localeCompare(b.name);
            //     });
            // });

            $scope.isOpen = false;
            let playerMultiselectContainer = element[0].getElementsByClassName('player-multiselect-container');

            $scope.$watch(function() {
                return angular.element(playerMultiselectContainer).hasClass('open');
            }, function(open) {
                $scope.isOpen = open;
            });

            if ($scope.selectedPlayerIds && $scope.selectedPlayerIds.length) {

                /* Populate player in dropdown. */
                $scope.players.map( tag => {

                    /* Mark the player tag checked in the dropdown if its in the
                     * selected player. */
                    tag.checked = !!~$scope.selectedPlayerIds.indexOf(tag.id);
                });
            }
        }

        return playerMultiselect;
    }
]);

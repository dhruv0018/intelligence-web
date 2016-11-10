/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/custom-tags-multiselect/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Custom Tags Multiselect
 * @module Custom Tags Multiselect
 */
const CustomTagsMultiselect = angular.module('CustomTagsMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'am.multiselect'
]);

/**
 * Custom Tags Multiselect directive.
 * @module Custom Tags Multiselect
 * @name Custom Tags Multiselect
 * @type {Directive}
 */
CustomTagsMultiselect.directive('customTagsMultiselect', [
    function directive() {

        const customTagsMultiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                customTags: '=',
                selectedCustomTagIds: '=ngModel'
            },

            link: link
        };

        function link($scope, element, attributes) {

            //Sort custom tags alphabetically
            $scope.$watch('customTags', () => {
                $scope.customTags.sort( (a, b) => {
                    return a.name.localeCompare(b.name);
                });
            });

            $scope.isOpen = false;
            let customTagsMultiselectContainer = element[0].getElementsByClassName('custom-tags-multiselect-container');

            $scope.$watch(function() {
                return angular.element(customTagsMultiselectContainer).hasClass('open');
            }, function(open) {
                $scope.isOpen = open;
            });

            if ($scope.selectedCustomTagIds && $scope.selectedCustomTagIds.length) {

                /* Populate custom tags in dropdown. */
                $scope.customTags.map( tag => {

                    /* Mark the custom tag checked in the dropdown if its in the
                     * selected custom tags. */
                    tag.checked = !!~$scope.selectedCustomTagIds.indexOf(tag.id);
                });
            }
        }

        return customTagsMultiselect;
    }
]);

export default CustomTagsMultiselect;

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'custom-tags-multiselect/template.html';
const multiselectTemplateUrl = 'custom-tags-multiselect/multiselect-template.html';

/* Component resources */
const template = require('./template.html');
const multiselectTemplate = require('./multiselect-template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Custom Tags Multiselect
 * @module Custom Tags Multiselect
 */
const CustomTagsMultiselect = angular.module('CustomTagsMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'ui.multiselect'
]);

/* Cache the template file */
CustomTagsMultiselect.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put(multiselectTemplateUrl, multiselectTemplate);
    }
]);

/**
 * Custom Tags Multiselect directive.
 * @module Custom Tags Multiselect
 * @name Custom Tags Multiselect
 * @type {Directive}
 */
CustomTagsMultiselect.directive('CustomTagsMultiselect', [
    function directive() {

        const customTagsMultiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                customTags: '=',
                selectedCustomTags: '=ngModel'
            },

            link: link
        };

        function link($scope, element, attributes) {
            console.log('hi');
            $scope.isOpen = false;
            let customTagsMultiselectContainer = element[0].getElementsByClassName('custom-tags-multiselect-container');

            $scope.$watch(function() {
                return angular.element(customTagsMultiselectContainer).hasClass('open');
            }, function(open) {
                $scope.isOpen = open;
            });

            if ($scope.selectedCustomTags && $scope.selectedCustomTags.length) {

                /* Populate custom tags in dropdown. */
                $scope.customTags.map( tag => {

                    /* Mark the custom tag checked in the dropdown if its in the
                     * selected custom tags. */
                    tag.checked = !!~$scope.selectedCustomTags.indexOf(tag.id);
                });
            }
        }

        return customTagsMultiselect;
    }
]);

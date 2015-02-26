
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-toolbar-template.html', require('./template.html'));
    }
]);

// require sub-directives
require('telestration-tool');

Telestrations.directive('telestrationToolbar', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-toolbar-template.html',
            require: ['^telestrations', '^telestrationControls'],
            scope: true,
            link: function(scope, elem, attr, controllers) {

                var telestrationsController = controllers[0];
                var telestrationControlsController = controllers[1];

                scope.telestrationsController = telestrationsController;
                scope.telestrationControls = telestrationControlsController;
                scope.TELESTRATION_TYPES = TELESTRATION_TYPES;
            }
        };
    }
]);


//used for top level items in a dropdown menu
// Telestrations.directive('menuItemState',[
//     'dropdownToolStates',
//     function(toolStates) {

//         function link(scope, elem) {
//             scope.clickCount = 0;
//             var optionsElement = elem[0].nextElementSibling;
//             var clickHandler;

//             switch (scope.dropdownType) {
//                 case 'color-picker':
//                     clickHandler = colorDropdownHandler;
//                     break;
//                 default:
//                     clickHandler = normalDropdownHandler;
//             }

//             elem.on('click', clickHandler);

//             function colorDropdownHandler() {
//                 optionsElement.className = 'active';
//             }

//             function normalDropdownHandler() {
//                 scope.clickCount = scope.clickCount + 1;
//                 //every second click open the menu
//                 if (scope.clickCount % 2 === 0) {
//                     optionsElement.className = 'active';
//                 } else {
//                     //on the odd clicks
//                     var choiceMade = scope.dropdownState;
//                     scope.selectedGlyphType = scope.dropdownState;
//                 }

//                 scope.$apply();
//             }

//             scope.$watch('selectedGlyphType', function() {
//                 optionsElement.className = '';
//             });

//             scope.$watch('dropdownState', function() {
//                 optionsElement.className = '';
//             });
//         }

//         return {
//             restrict: 'AE',
//             scope: {
//                 //the dropdown this item controls
//                 dropdownState: '=?',
//                 selectedGlyphType: '=?',
//                 selectedGlyphColor: '=?',
//                 //exhibits different behavior if it's a normal dropdown or color picker
//                 dropdownType: '@?'
//             },
//             link: link
//         };
//     }
// ]);


// Telestrations.directive('telestrationMenu', [
//     '$timeout', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS', 'dropdownToolStates',
//     function($timeout, TELESTRATION_TYPES, TELESTRATION_COLORS, toolStates) {
//         return {
//             restrict: 'E',
//             templateUrl: 'telestration-menu.html',
//             require: ['telestrationMenu', '^telestrationControls', '^telestrations'],
//             controller: [
//                 '$scope', '$element',
//                 function($scope, $element) {

//                     var self = this;

//                     var telestrationsController = $element.inheritedData('$telestrationsController');

//                     self.hide = function hideTelestrationControlsMenu() {
//                         $element[0].style.display = 'none';
//                         $scope.isMenuDisplayed = false;
//                         telestrationsController.telestrationContainerElement.removeClass('telestrations-active');
//                     };

//                     self.show = function showTelestrationControlsMenu() {
//                         $element[0].style.display = 'block';
//                         $scope.isMenuDisplayed = true;
//                         telestrationsController.telestrationContainerElement.addClass('telestrations-active');
//                     };

//                     self.toggle = function toggleTelestrationControlsMenu() {
//                         if ($scope.isMenuDisplayed) {
//                             self.hide();
//                         } else {
//                             self.show();
//                         }
//                     };

//                 }
//             ],
//             link: function(scope, elem, attr, ctrls) {

//                 /* Initialize */
//                 var menuCtrl = ctrls[0]; // grab the instance of the menuCtrl controller
//                 var parentMenu = ctrls[1];
//                 var telestrationsController = ctrls[2];

//                 parentMenu.$registerMenuControl(menuCtrl);

//                 scope.telestrationsController = telestrationsController;
//                 scope.TELESTRATION_TYPES = TELESTRATION_TYPES;

//                 // A way to keep track of the current selected tool in dropdown menus
//                 scope.dropdownToolStates = toolStates;
//                 scope.colors = TELESTRATION_COLORS;

//                 // Hide initially
//                 elem[0].style.display = 'none';
//                 scope.isMenuDisplayed = false;

//             }
//         };
//     }
// ]);

// Telestrations.service('dropdownToolStates', [
//     'TELESTRATION_TYPES', 'TELESTRATION_COLORS',
//     function(TELESTRATION_TYPES, TELESTRATION_COLORS) {
//         var toolStates = {
//             'FREEHAND': TELESTRATION_TYPES.FREEHAND_SOLID,
//             'T_BAR': TELESTRATION_TYPES.T_BAR_SOLID,
//             'ARROW': TELESTRATION_TYPES.ARROW_SOLID,
//             'COLOR_PICKER': TELESTRATION_COLORS.PRIMARY.hex
//         };
//         return toolStates;
//     }
// ]);

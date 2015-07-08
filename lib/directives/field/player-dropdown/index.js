// /* Constants */
// var TO = '';
// var ELEMENTS = 'E';
//
// var templateUrl = 'field/player-dropdown.html';
//
// /* Component resources */
// var template = require('./template.html');
//
// /* Fetch angular from the browser scope */
// var angular = window.angular;
//
// /**
//  * PlayerDropdown
//  * @module PlayerDropdown
//  */
// var PlayerDropdown = angular.module('Field.PlayerDropdown', []);
//
// /* Cache the template file */
// PlayerDropdown.run([
//     '$templateCache',
//     function run($templateCache) {
//
//         $templateCache.put(templateUrl, template);
//         $templateCache.put('field/player-dropdown-input.html', require('./player-dropdown-input.html'));
//     }
// ]);
//
// /**
//  * PlayerDropdown directive.
//  * @module PlayerDropdown
//  * @name PlayerDropdown
//  * @type {Directive}
//  */
// PlayerDropdown.directive('playerDropdownField', [
//     function directive() {
//
//         var PlayerDropdown = {
//
//             restrict: TO += ELEMENTS,
//             templateUrl: templateUrl,
//             scope: {
//                 field: '=',
//                 event: '='
//             },
//             controller: [
//                 '$scope',
//                 function($scope){
//                     $scope.isSelecting = false;
//                     $scope.selectedValue = $scope.field.value;
//
//                     $scope.selectValue = (value) => {
//                         $scope.field.currentValue = value;
//                         let currentValue = $scope.field.currentValue;
//                         $scope.isSelecting = false;
//                     };
//
//                     $scope.onBlur = () => {
//                         //console.log('on blur firing');
//                         $scope.isSelecting = false;
//                     };
//
//                     $scope.onFocus = () => {
//                         //console.log('on focus');
//                     };
//
//                     $scope.onChange = function() {
//                         console.log('firing on change');
//                         $scope.event.activeEventVariableIndex = $scope.field.order + 1;
//                         console.log($scope.event.activeEventVariableIndex);
//                     };
//
//                     $scope.shouldFocus = function() {
//                         console.log('inside shouldFocus');
//                         console.log($scope.event.activeEventVariableIndex == $scope.field.order);
//                         return $scope.event.activeEventVariableIndex == $scope.field.order;
//                     };
//                 }
//             ],
//         };
//
//         return PlayerDropdown;
//     }
// ]);

// require('gap');
// require('text');
// require('yard');
// require('arena');
// require('static');
// require('dropdown');
// require('formation');
// require('passing-zone');
// require('team-dropdown');
require('player-dropdown');
// require('team-player-dropdown');

/**
 * Field
 * @module Field
 */
var Field = angular.module('Field', [
    'Field.PlayerDropdown'
]);

/**
 * Field directive.
 * @module Field
 * @name Field
 * @type {Directive}
 */
Field.directive('krossoverField', [
    function directive() {
        var Field = {

            restrict: 'E',
            scope: {
                field: '='
            },
            controller: [
                '$scope',
                function($scope){
                    console.log($scope.field);
                }
            ]
            //template: '<p>{{field.inputType}} -- {{field.value.name}}</p>'
        };

        return Field;
    }
]);

// class FieldCtrl{
//     constructor() {
//         console.log('hello world from constructor');
//     }
// }

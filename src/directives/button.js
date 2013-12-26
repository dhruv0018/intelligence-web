var TO = '';
var ELEMENTS = 'E';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('buttonAddNew', [
    '$parse',
    function($parse) {

        var directive = {

            restrict: TO += ELEMENTS,
            transclude: true,
            template: '<button class="btn-add-new" data-ng-click="add()" data-ng-transclude><i class="btn btn-primary pull-right icon-plus"></i></button>'
        };

        return directive;
    }
]);


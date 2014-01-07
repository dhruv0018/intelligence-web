var TO = '';
var ELEMENTS = 'E';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('buttonAddNew', [
    '$parse',
    function($parse) {

        var directive = {

            restrict: TO += ELEMENTS,
            transclude: true,
            template: '<button class="btn-add-new" data-ng-click="add()"><span data-ng-transclude></span> <i class="btn btn-primary pull-right icon-plus"></i></button>'
        };

        return directive;
    }
]);

IntelligenceWebClient.directive('buttonContinue', [
    '$parse',
    function($parse) {

        var directive = {

            restrict: TO += ELEMENTS,
            replace: true,
            transclude: true,
            template: '<button class="btn-submit-continue" data-ng-click="save()"><span data-ng-transclude></span> <i class="icon-chevron-right pull-right"></i></button>'
        };

        return directive;
    }
]);

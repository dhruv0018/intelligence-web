var TO = '';
var ELEMENTS = 'E';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('button', [
    '$rootScope',
    function($rootScope) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link
        };

        function link($scope, element, attributes, controller) {

            var disabled = attributes.disabled;

            $rootScope.$on('$stateChangeStart', function() {

                attributes.$set('disabled', true);
            });

            $rootScope.$on('$stateChangeSuccess', function() {

                attributes.$set('disabled', !!disabled);
            });

            $rootScope.$on('$stateChangeError', function() {

                attributes.$set('disabled', !!disabled);
            });
        }

        return directive;
    }
]);

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

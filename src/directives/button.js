var TO = '';
var ELEMENTS = 'E';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('button', [
    '$rootScope',
    function($rootScope) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link
        };

        function link($scope, element, attributes, controller) {

            var disabled = attributes.disabled;

            /* Disable buttons on start of state change */
            $rootScope.$on('$stateChangeStart', function() {

                attributes.$set('disabled', true);
            });

            /* Reset disabled button state on state change success */
            $rootScope.$on('$stateChangeSuccess', function() {

                attributes.$set('disabled', !!disabled);
            });

            /* Reset disabled button state on state change error */
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
            template: '<button data-ng-attr-id="{{elemId}}" class="btn-add-new" data-ng-click="add()"><span data-ng-transclude></span> <i class="btn btn-primary pull-right icon icon-plus"></i></button>',
            link: function (scope, element, attrs) {

                scope.elemId = attrs.elemId;
            }
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
            template: '<button class="btn-submit-continue" data-ng-click="save()"><span data-ng-transclude></span> <i class="icon icon-chevron-right pull-right"></i></button>'
        };

        return directive;
    }
]);

IntelligenceWebClient.directive('checkboxButton', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {

            // set/unset 'active' class when model changes
            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                element.toggleClass('active', ctrl.$viewValue);
            });

            // update model when button is clicked
            element.bind('click', function(event) {

                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(!ctrl.$viewValue);
                });

                event.stopPropagation();
            });
        }
    };
});

var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A directive to handle the visibility of the error element following input
 * fields. The field is shown outside the input as long as the browser window is
 * wide enough. If the browser is not wide enough or is resized then the error
 * replaces the placeholder inside the input field.
 * @module IntelligenceWebClient
 * @name input
 * @type {directive}
 * @augments input
 * @kind element
 */
IntelligenceWebClient.directive('input', [
    '$rootScope', '$window',
    function($rootScope, $window) {

        var directive = {

            restrict: TO += ELEMENTS,
            priority: 2,
            link: link
        };

        function link($scope, element, attributes) {

            var next = element.next();
            var placeholder = attributes.placeholder;

            /* Handle window resize events. */
            var handleResize = function(event, resize) {

                if (next[0] && next[0].className === 'error') {

                    var nextWidth = next[0].offsetWidth;
                    var nextLeft = next[0].getBoundingClientRect().left;
                    var nextRight = nextLeft + nextWidth;

                    if (resize.width < nextRight) {

                        next.css('visibility', 'hidden');
                        element.attr('placeholder', next.text());

                    } else {

                        next.css('visibility', 'visible');
                        element.attr('placeholder', placeholder);
                    }
                }
            };

            /* Monitor and respond to resize events. */
            $rootScope.$on('resize', handleResize);

            /* Resize appropriately on initial load. */
            handleResize(null, { width: $window.outerWidth });
        }

        return directive;
    }
]);

/**
 * A directive to manage input errors. It allows errors to be described in a
 * attribute named `error` on the input element. The `error` attribute should be
 * an object containing named error keys that map to their corresponding error
 * strings to be displayed. The keys should match the keys used by the model
 * validator. This directive will then create an element that displays those
 * descriptions on validation errors after the input.
 * @module IntelligenceWebClient
 * @name input
 * @type {directive}
 * @augments input
 * @kind attribute
 */
IntelligenceWebClient.directive('input', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            priority: 1,
            require: '?ngModel',
            link: link
        };

        function link($scope, element, attributes, controller) {

            if (!attributes.errors) return;
            if (!controller) return;

            /* Evaluate errors attribute for Angular expressions. */
            var errors = $scope.$eval(attributes.errors);

            /* Create error element. */
            element.after('<data-error></data-error>');
            element.next()
                .addClass('error')
                .css('position', 'absolute')
                .css('top', 0)
                .css('left', element[0].offsetWidth + 'px')
                .css('line-height', element[0].offsetHeight + 'px')
                .css('white-space', 'nowrap');

            /* Watch the model for errors. */
            $scope.$watch(function() {

                return controller.$error;

            }, function($error) {

                if (controller.$dirty) {

                    /* Clear error. */
                    element.next().empty();
                    element.removeClass('has-error');

                    /* Walk through errors in order, allowing the next error to
                     * overwrite the previous to establish priority. */
                    Object.keys(errors).forEach(function(error) {

                        if ($error[error]) {

                            element.addClass('has-error');
                            element.next().html(errors[error]);
                        }
                    });
                }

            }, true);
        }

        return directive;
    }
]);

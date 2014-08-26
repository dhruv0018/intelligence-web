var TO = '';
var ATTRIBUTES = 'A';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('autotab', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes, controller) {

            function onBlur() {

                var form = element[0].form;

                if (!form) return;

                for (var index = 0; index < form.length; index++) {

                    var current = form[index];

                    if (current.tabIndex > attributes.tabindex) {

                        current.focus();
                    }
                }
            }

            element.on('blur', onBlur);
        }

        return directive;
    }
]);


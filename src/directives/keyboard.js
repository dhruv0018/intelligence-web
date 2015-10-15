var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var pkg = require('../../package.json');

var Mousetrap = window.Mousetrap;

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('keybinding', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes) {

            var keybinding = parseKeybinding(attributes.keybinding);

            Mousetrap.bind(keybinding, function() {

                if (!attributes.disabled) {

                    element.triggerHandler('click');
                }
            });

            /*
             * FIXME:
             * Causes bindings to be over written when tag shortcut keys overlap
             */
            // element.on('$destroy', function() {
            //
            //     var keybinding = parseKeybinding(attributes.keybinding);
            //
            //     Mousetrap.unbind(keybinding);
            // });
        }

        var parseKeybinding = function(keybinding) {

            keybinding = keybinding.toLowerCase();
            keybinding = keybinding.split('').join(' ');

            return keybinding;
        };

        return directive;
    }
]);

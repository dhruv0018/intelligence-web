var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var Mousetrap = require('Mousetrap');

var IntelligenceWebClient = require('../app');

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

            element.on('$destroy', function() {

                var keybinding = parseKeybinding(attributes.keybinding);

                Mousetrap.unbind(keybinding);
            });
        }

        var parseKeybinding = function(keybinding) {

            keybinding = keybinding.toLowerCase();
            keybinding = keybinding.split('').join(' ');

            return keybinding;
        };

        return directive;
    }
]);


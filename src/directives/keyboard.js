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

            var keybinding = attributes.keybinding;

            if (keybinding.length === 2) {

                keybinding = keybinding.split('').join(' ');
            }

            Mousetrap.bind(keybinding, function() {

                if (!attributes.disabled) {

                    element.triggerHandler('click');
                }
            });

            element.on('$destroy', function() {

                Mousetrap.unbind(attributes.keybinding);
            });
        }

        return directive;
    }
]);


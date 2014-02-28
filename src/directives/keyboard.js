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

            Mousetrap.bind(attributes.keybinding, function() {

                element.triggerHandler('ngClick');
            });
        }

        return directive;
    }
]);


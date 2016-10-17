const angular = window.angular;

import TelestrationTool from './telestration-tool';

const TelestrationToolbar = angular.module('TelestrationToolbar', [
    'TelestrationTool'
]);

TelestrationToolbar.directive('telestrationToolbar', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.telestrationsController = telestrationsController;

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);

export default TelestrationToolbar;

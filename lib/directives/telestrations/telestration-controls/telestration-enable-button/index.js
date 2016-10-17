const angular = window.angular;

const TelestrationEnableButton = angular.module('TelestrationEnableButton', []);

// Directives
TelestrationEnableButton.directive('telestrationEnableButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-enable-button/template.html',
            scope: true,
            link: function telestrationEnableButtonLink(scope, element) {

                scope.enabled = false;

                element.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);

export default TelestrationEnableButton;

const angular = window.angular;

const UndoTool = angular.module('UndoTool', []);

UndoTool.directive('undoTool', [
    function() {
        return {
            restrict: 'E',
            require: '^telestrations',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/undo-tool/template.html',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.removeLast = telestrationsController.removeLast;
            }
        };
    }
]);

export default UndoTool;

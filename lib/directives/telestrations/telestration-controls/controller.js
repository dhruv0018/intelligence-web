module.exports = [
    '$scope', '$element',
    function($scope, $element) {

        var self = this;
        var menuCtrl;

        self.$registerMenuControl = function $registerMenuControl(control) {

            menuCtrl = control;

        };

        $scope.toggleControls = function toggleControls($event) {

            $event.stopImmediatePropagation();

            if (angular.isDefined(menuCtrl)) menuCtrl.toggle();
            else angular.noop();

        };
    }
];

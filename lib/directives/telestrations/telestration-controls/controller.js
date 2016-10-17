TelestrationControlsController.$inject = [
    '$scope',
    '$element',
];

function TelestrationControlsController(
    $scope,
    $element
) {

    var self = this;

    var telestrationsController = $element.inheritedData('$telestrationsController');

    // Assignments

    self.telestrationsController = telestrationsController;

    self.toggleControls = function toggleControls(event) {

        event.stopPropagation();

        self.dropdownToggled = false;

        telestrationsController.controlsToggled();
    };

    self.dropdownToggled = false;
}

export default TelestrationControlsController;

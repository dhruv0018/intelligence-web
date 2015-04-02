module.exports = [
    '$scope', '$element',
    function($scope, $element) {

        var self = this;

        var telestrationsController = $element.inheritedData('$telestrationsController');

        // Assignments

        self.telestrationsController = telestrationsController;

        self.toggleControls = function toggleControls(event) {

            event.stopPropagation();

            self.dropdownToggled = false;
            telestrationsController.isEnabled  = !telestrationsController.isEnabled;
        };

        self.dropdownToggled = false;
    }
];

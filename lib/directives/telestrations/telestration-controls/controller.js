module.exports = [
    '$scope', '$element',
    function($scope, $element) {

        var self = this;

        var telestrationsController = $element.inheritedData('$telestrationsController');

        // Assignments

        self.telestrationsController = telestrationsController;
        self.enabled = false;

        self.toggleControls = function toggleControls(event) {

            event.stopPropagation();

            self.enabled = !self.enabled;
        };
    }
];

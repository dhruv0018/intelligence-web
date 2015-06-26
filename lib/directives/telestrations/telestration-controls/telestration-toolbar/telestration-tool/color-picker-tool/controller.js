function ColorPickerToolController($scope, $element, TELESTRATION_COLORS) {

    /* Add dependencies */

    this.telestrationsController = $element.inheritedData('$telestrationsController');
    this.telestrationControls = $element.inheritedData('$telestrationControlsController');

    this.TELESTRATION_COLORS = TELESTRATION_COLORS;

    /* Add Scope Helpers */

    this.getColorStyle = color => ({color: color.hex});

    this.changeColor = color => {

        this.telestrationsController.selectedGlyphColor = color;
    };
}

ColorPickerToolController.$inject = [
    '$scope',
    '$element',
    'TELESTRATION_COLORS',
];

export default ColorPickerToolController;

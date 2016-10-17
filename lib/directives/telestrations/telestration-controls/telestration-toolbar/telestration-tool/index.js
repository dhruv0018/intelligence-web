const angular = window.angular;

import ArrowGlyphTool from './arrow-glyph-tool';
import CircleGlyphTool from './circle-glyph-tool';
import CircleSpotlightGlyphTool from './circle-spotlight-glyph-tool';
import ColorPickerTool from './color-picker-tool';
import ConeSpotlightGlyphTool from './cone-spotlight-glyph-tool';
import FreehandGlyphTool from './freehand-glyph-tool';
import TBarGlyphTool from './tbar-glyph-tool';
import TextGlyphTool from './text-glyph-tool';
import UndoTool from './undo-tool';

const TelestrationTool = angular.module('TelestrationTool', [
    'ArrowGlyphTool',
    'CircleGlyphTool',
    'CircleSpotlightGlypehTool',
    'ColorPicterTool',
    'ConeSpotlightGlyphTool',
    'FreehandGlyphTool',
    'TBarGlyphTool',
    'TextGlyphTool',
    'UndoTool'
]);

TelestrationTool.directive('telestrationTool', [
    function() {
        return {
            restrict: 'EA',
            require: '^telestrations',
            scope: true,
            controllerAs: 'telestrationTool',
            controller: [
                '$scope', '$element',
                function toolController($scope, $element) {

                    var self = this;

                    var telestrationsController = $element.inheritedData('$telestrationsController');

                    self.select = function select(glyphType) {

                        telestrationsController.selectedGlyphType = glyphType;
                        telestrationsController.toolToggled(glyphType);
                    };
                }
            ]
        };
    }
]);

export default TelestrationTool;

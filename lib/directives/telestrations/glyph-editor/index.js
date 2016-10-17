const angular = window.angular;

import controller from './controller';

const GlyphEditor = angular.module('GlyphEditor', []);

GlyphEditor.directive('glyphEditor', GlyphEditorDirective);

GlyphEditorDirective.$inject = [];

function GlyphEditorDirective() {
    return {
        restrict: 'AE',
        scope: true,
        templateUrl: 'lib/directives/telestrations/glyph-editor/template.html',
        require: '^telestrations',
        controller,
        transclude: true
    };
}

export default GlyphEditor;

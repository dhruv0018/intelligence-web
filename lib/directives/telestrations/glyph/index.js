const angular = window.angular;

import NonSvgGlyph from './non-svg-glyph';
import SvgGlyph from './svg-glyph';

const Glyph = angular.module('Glyph', [
    'NonSvgGlyph',
    'SvgGlyph'
]);

// Directive
Glyph.directive('glyph', GlyphDirective);

GlyphDirective.$inject = ['TELESTRATION_TYPES'];

function GlyphDirective(TELESTRATION_TYPES) {
    return {
        restrict: 'E',
        templateUrl: 'lib/directives/telestrations/glyph/template.html',
        scope: {
            glyphObject: '='
        },
        link: function linkGlyph($scope) {

            $scope.TELESTRATION_TYPES = TELESTRATION_TYPES;
        }
    };
}

export default Glyph;

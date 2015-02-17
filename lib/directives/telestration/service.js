
/* Telestration Interface */

module.exports = [
    'TELESTRATION_TYPES', 'TELESTRATION_COLORS',
    function(TELESTRATION_TYPES, TELESTRATION_COLORS) {

        return {
            game: null,
            currentTelestration: null,
            selectedGlyph: null,
            isDrawing: false,
            selectedGlyphType: TELESTRATION_TYPES.FREEHAND,
            selectedGlyphColor: TELESTRATION_COLORS.PRIMARY.hex,
            currentZIndex: 1,
            telestrationContainerElement: undefined,
            hideTelestrationControlsMenu: undefined,
            showTelestrationControlsMenu: undefined,
            toggleTelestrationControlsMenu: undefined,
            telestrationSVG: undefined,
            isEditEnabled: false
        };
    }
];

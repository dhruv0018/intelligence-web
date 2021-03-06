const angular = window.angular;

const NonSvgGlyph = angular.module('NonSvgGlyph', []);

// Directive
NonSvgGlyph.directive('nonSvgGlyph', NonSvgGlyphDirective);

NonSvgGlyphDirective.$inject = [
    '$window',
    '$timeout',
    'VideoPlayerEventEmitter',
    'TELESTRATION_PERMISSIONS',
    'VIDEO_PLAYER_EVENTS'
];

function NonSvgGlyphDirective(
    $window,
    $timeout,
    videoPlayerEventEmitter,
    TELESTRATION_PERMISSIONS,
    VIDEO_PLAYER_EVENTS
) {

    return {
        restrict: 'E',
        scope: true,
        require: ['?^glyphEditor', '^telestrations'],
        link: function(scope, element, attributes, controllers) {

            scope.glyphObject.render();
            /* Initialization */
            var glyphEditor = controllers[0];
            var telestrationsController = controllers[1];

            if (telestrationsController.permissions !== TELESTRATION_PERMISSIONS.EDIT) {
                glyphEditor = null;
                scope.glyphObject.removeListeners();
            }

            glyphEditor = glyphEditor || {
                'initialize': angular.noop,
                'setEditRegion': angular.noop,
                'onResize': angular.noop,
                'hide': angular.noop,
                'onResizeEnd': angular.noop,
                'setDraggableConstraintFn': angular.noop
            };

            glyphEditor.initialize();
            telestrationsController.updated();

            /* Register Listeners and Bind Handlers */

            scope.glyphObject.onBlur(onBlur);
            scope.glyphObject.onSelectedMouseup(onSelectedMouseup);
            scope.glyphObject.onDragStart(dragStart);
            scope.glyphObject.onDragEnd(dragEnd);
            scope.glyphObject.onTextChanged(textChanged);

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, resetGlyphContext);


            /* Helpers */

            var containerX = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().top; };


            /* Define Handlers */

            function dragEnd() {

                telestrationsController.save();
            }

            function textChanged() {

                telestrationsController.save();
            }

            function resetGlyphContext() {

                glyphEditor.hide();

                // render on next cycle waiting for DOM to make sure renders in correct location with correct size
                $timeout(function kickToNextCycle() {
                    scope.glyphObject.render();
                });
            }

            function onBlur(event) {

                scope.$apply(function apply() {

                    telestrationsController.selectedGlyph = undefined;
                    glyphEditor.hide();
                });
            }

            function dragStart() {

                glyphEditor.hide();
            }

            function onSelectedMouseup(event) {

                telestrationsController.selectedGlyph = scope.glyphObject;

                // Bring glyph to the front of the contextgs
                // TODO: Implement function
                // scope.glyphObject.bringToFront();
            }

            function removeEventListeners() {

                $window.removeEventListener('resize', resetGlyphContext);
                videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.FULLSCREEN, resetGlyphContext);
            }


            /* Cleanup on Destroy */

            element.on('$destroy', function() {
                glyphEditor.hide();
                removeEventListeners();
            });
        }
    };
}

export default NonSvgGlyph;

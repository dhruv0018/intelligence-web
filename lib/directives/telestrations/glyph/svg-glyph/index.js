
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

// Directive
Telestrations.directive('svgGlyph', SvgGlyph);

SvgGlyph.$inject = [
    '$window',
    'VideoPlayerEventEmitter',
    'TELESTRATION_PERMISSIONS',
    'VIDEO_PLAYER_EVENTS'
];

function SvgGlyph(
    $window,
    videoPlayerEventEmitter,
    TELESTRATION_PERMISSIONS,
    VIDEO_PLAYER_EVENTS
) {

    return {
        restrict: 'E',
        scope: true,
        require: ['?^glyphEditor', '^telestrations'],
        link: function svgGlyphLink(scope, element, attributes, controllers) {

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


            /* Register Listeners and Bind Handlers */

            // Basic click/drag interactions on defined glyph

            scope.glyphObject.onBlur(onBlur);
            scope.glyphObject.onSelectedMouseup(onSelectedMouseup);
            scope.glyphObject.onDragStart(dragStart);
            scope.glyphObject.onDragEnd(dragEnd);

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, resetGlyphContext);

            // Drawing a Glyph

            if (telestrationsController.isDrawing) {

                telestrationsController.telestrationSVGContainer.on('mousemove', glyphDrawing);
                telestrationsController.telestrationSVGContainer.on('mouseup', glyphDrawEnd);
                telestrationsController.telestrationSVGContainer.on('mouseleave', glyphDrawOutOfBounds);
            }

            // Set Glyph and Editor Constraint Function

            if (telestrationsController.permissions === TELESTRATION_PERMISSIONS.EDIT) {

                var glyphObject = scope.glyphObject.getShapeContext();

                if (glyphObject) {

                    scope.glyphObject.setDraggableConstraintFn(getConstraintFn(glyphObject));

                } else {

                    scope.glyphObject.setDraggableConstraintFn();
                }

                glyphEditor.setDraggableConstraintFn(getConstraintFn());
            }


            /* Helpers */

            function containerX() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().left; }
            function containerY() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().top; }


            /* Define Handlers */

            function onSelectedMouseup(event) {

                telestrationsController.selectedGlyph = scope.glyphObject;

                // Bring glyph to the front of the context
                scope.glyphObject.bringToFront();

                if (scope.glyphObject.isResizable()) {

                    // update the glyph edit widget positions
                    var glyphVerticesInPixels = scope.glyphObject.getVerticesInPixels();
                    if (glyphVerticesInPixels) glyphEditor.setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                    // Update the glyph vertices as redraw glyph as the glyph resize widgets change position
                    glyphEditor.onResize(function resizeCallback(start, end) {

                        scope.glyphObject.updateVertexFromPixels(0, start.x, start.y);
                        scope.glyphObject.updateVertexFromPixels(1, end.x, end.y);
                        scope.glyphObject.renderShape();
                    });

                    glyphEditor.onResizeEnd(function saveTelestrations() {

                        telestrationsController.save();
                    });

                    scope.glyphObject.registerResizeNodes(glyphEditor.getNodes());
                }
            }

            function dragStart() {

                glyphEditor.hide();
            }

            function dragEnd() {

                telestrationsController.save();
            }

            function resetGlyphContext() {

                glyphEditor.hide();
                scope.glyphObject.render();
            }

            function onBlur(event) {

                telestrationsController.selectedGlyph = undefined;
                glyphEditor.hide();
            }

            function glyphUpdate(startVertex, EndVertex) {

                scope.glyphObject.updateEndPointFromPixels(startVertex, EndVertex);
                scope.glyphObject.render();
            }


            /* Create Drawing Handlers */

            function glyphDrawing(mouseEvent) {

                var startPoint = scope.glyphObject.getVertexInPixelsAtIndex(0);

                if (startPoint) {

                    var startRelativePixelX = mouseEvent.x - containerX();
                    var startRelativePixelY = mouseEvent.y - containerY();

                    glyphUpdate(startRelativePixelX, startRelativePixelY);
                }
            }

            function glyphDrawEnd(mouseEvent) {

                if (scope.glyphObject.hasMinimumVertices()) {

                    var startRelativePixelX = mouseEvent.x - containerX();
                    var startRelativePixelY = mouseEvent.y - containerY();

                    glyphUpdate(startRelativePixelX, startRelativePixelY);

                    telestrationsController.currentZIndex = telestrationsController.currentZIndex + 1;

                    // save new glyph
                    telestrationsController.updated();
                    telestrationsController.save();

                } else {
                    // Discard this glyph if doesn't have vertices
                    telestrationsController.currentTelestration.glyphs.remove(scope.glyphObject);
                    scope.$apply();
                }

                // Disable drawing

                telestrationsController.isDrawing = false;

                // remove temporary listeners

                telestrationsController.telestrationSVGContainer.off('mouseleave', glyphDrawOutOfBounds);
                telestrationsController.telestrationSVGContainer.off('mousemove', glyphDrawing);
                telestrationsController.telestrationSVGContainer.off('mouseup', glyphDrawEnd);

            }

            function glyphDrawOutOfBounds() {

                telestrationsController.telestrationSVGContainer.off('mousemove', glyphDrawing);
                telestrationsController.telestrationSVGContainer.off('mouseup', glyphDrawEnd);
                telestrationsController.telestrationSVGContainer.off('mouseleave', glyphDrawOutOfBounds);
            }


            // Draggable Constraints Handler

            /* getContraintFn
             * @param shape - a drawn SVG object
             * Returns a function that determines if any edge the glyph's bounding box is outside of the
             * bounding container for telestrations.
             */
            function getConstraintFn(glyphObject) {

                return function isVertexBounded(x, y) {

                    var containerBox = telestrationsController.telestrationSVGContainer[0].getBoundingClientRect();

                    if (glyphObject) return (x > 0) && (x < containerBox.width - glyphObject.width()) && (y > 0) && (y < containerBox.height - glyphObject.height());
                    else return (x > 0) && (x < containerBox.width) && (y > 0) && (y < containerBox.height);
                };
            }


            // Remove Event Listeners

            function removeEventListeners() {

                telestrationsController.telestrationSVGContainer.off('mouseleave', glyphDrawOutOfBounds);
                telestrationsController.telestrationSVGContainer.off('mousemove', glyphDrawing);
                telestrationsController.telestrationSVGContainer.off('mouseup', glyphDrawEnd);

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

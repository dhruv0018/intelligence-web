
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

// Directive
Telestrations.directive('svgGlyph', SvgGlyph);

SvgGlyph.$inject = ['$window', 'VideoPlayerEventEmitter', 'TELESTRATION_PERMISSIONS'];

function SvgGlyph($window, videoPlayerEventEmitter, TELESTRATION_PERMISSIONS) {
    return {
        restrict: 'E',
        scope: true,
        require: ['?^glyphEditor', '^telestrations'],
        link: function svgGlyphLink($scope, elem, attr, ctrls) {

            /* Initialization */
            var glyphEditor = ctrls[0];
            var telestrationsCtrl = ctrls[1];

            if (telestrationsCtrl.permissions !== TELESTRATION_PERMISSIONS.EDIT) {
                glyphEditor = null;
                $scope.glyphObject.removeListeners();
            }

            glyphEditor = glyphEditor || {
                '$initialize': angular.noop,
                '$setEditRegion': angular.noop,
                '$onResize': angular.noop,
                '$hide': angular.noop,
                '$onResizeEnd': angular.noop,
                '$setDraggableConstraintFn': angular.noop,
                '$onDeleteClick': angular.noop
            };

            glyphEditor.$initialize();


            /* Helpers */

            var containerX = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().top; };

            var glyphUpdate = function glyphUpdate(startVertex, EndVertex) {

                $scope.glyphObject.updateEndPointFromPixels(startVertex, EndVertex);
                $scope.glyphObject.render();
            };


            /* Create Event Handlers */

            // Create Mouse Event Functions for Drawing

            var glyphDrawing = function glyphDrawing(mouseEvent) {

                var startPoint = $scope.glyphObject.getVertexInPixelsAtIndex(0);

                if (startPoint) {

                    var startRelativePixelX = mouseEvent.x - containerX();
                    var startRelativePixelY = mouseEvent.y - containerY();

                    glyphUpdate(startRelativePixelX, startRelativePixelY);
                }
            };

            var glyphDrawEnd = function glyphDrawEnd(mouseEvent) {

                if ($scope.glyphObject.hasMinimumVertices()) {

                    var startRelativePixelX = mouseEvent.x - containerX();
                    var startRelativePixelY = mouseEvent.y - containerY();

                    glyphUpdate(startRelativePixelX, startRelativePixelY);

                    telestrationsCtrl.currentZIndex = telestrationsCtrl.currentZIndex + 1;

                    // save new glyph
                    telestrationsCtrl.$updated();
                    telestrationsCtrl.$save();
                } else {
                    // Discard this glyph if doesn't have vertices
                    telestrationsCtrl.currentTelestration.glyphs.remove($scope.glyphObject);
                    $scope.$apply();
                }

                // Disable drawing

                telestrationsCtrl.isDrawing = false;

                // remove temporary listeners

                telestrationsCtrl.telestrationContainerElement.off('mouseleave', glyphDrawOutOfBounds);
                telestrationsCtrl.telestrationContainerElement.off('mousemove', glyphDrawing);
                telestrationsCtrl.telestrationContainerElement.off('mouseup', glyphDrawEnd);

            };

            var glyphDrawOutOfBounds = function glyphDrawOutOfBounds() {

                telestrationsCtrl.telestrationContainerElement.off('mousemove', glyphDrawing);
                telestrationsCtrl.telestrationContainerElement.off('mouseup', glyphDrawEnd);
                telestrationsCtrl.telestrationContainerElement.off('mouseleave', glyphDrawOutOfBounds);
            };

            // Window Resize Handlers

            var resetGlyphContext = function resetGlyphContext() {

                glyphEditor.$hide();

                // draw glyph
                $scope.glyphObject.render();
            };

            // Focus Loss Handler

            var glyphOutOfFocus = function glyphOutOfFocus(event) {
                glyphEditor.$hide();
                $window.removeEventListener('click', glyphOutOfFocus);
            };

            // Draggable Constraints Handler

            /* getContraintFn
             * @param shape - a drawn SVG object
             */

            var getConstraintFn = function getConstraintFn(glyphObject) {

                return function isVertexBounded(x, y) {

                    var containerBox = telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect();

                    if (glyphObject) return (x > 0) && (x < containerBox.width - glyphObject.width()) && (y > 0) && (y < containerBox.height - glyphObject.height());
                    else return (x > 0) && (x < containerBox.width) && (y > 0) && (y < containerBox.height);
                };
            };

            // Remove Event Listeners

            var removeEventListeners = function removeEventListeners() {

                telestrationsCtrl.telestrationContainerElement.off('mouseleave', glyphDrawOutOfBounds);
                telestrationsCtrl.telestrationContainerElement.off('mousemove', glyphDrawing);
                telestrationsCtrl.telestrationContainerElement.off('mouseup', glyphDrawEnd);

                $window.removeEventListener('click', glyphOutOfFocus);
                $window.removeEventListener('resize', resetGlyphContext);
                videoPlayerEventEmitter.removeListener('fullscreen', resetGlyphContext);
            };


            /* Register Listeners and Bind Handlers */

            // Drawing a Glyph

            if (telestrationsCtrl.isDrawing) {
                telestrationsCtrl.telestrationContainerElement.on('mousemove', glyphDrawing);
                telestrationsCtrl.telestrationContainerElement.on('mouseup', glyphDrawEnd);
                telestrationsCtrl.telestrationContainerElement.on('mouseleave', glyphDrawOutOfBounds);
            }

            // Set Glyph and Editor Constraint Function

            if (telestrationsCtrl.permissions === TELESTRATION_PERMISSIONS.EDIT) {

                var glyphObject = $scope.glyphObject.getShapeContext();

                if (glyphObject) {
                    $scope.glyphObject.setDraggableConstraintFn(getConstraintFn(glyphObject));
                } else {
                    $scope.glyphObject.setDraggableConstraintFn();
                }

                glyphEditor.$setDraggableConstraintFn(getConstraintFn());
            }

            // Glyph Clicked

            $scope.glyphObject.onClick(function(event) {

                event.stopPropagation();

                // hide glyph editor if you click out of glyph
                $window.addEventListener('click', glyphOutOfFocus);

                // Bring glyph to the front of the context
                $scope.glyphObject.bringToFront();

                // update the glyph edit widget positions
                var glyphVerticesInPixels = $scope.glyphObject.getVerticesInPixels();
                if (glyphVerticesInPixels) glyphEditor.$setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                // Update the glyph vertices as redraw glyph as the glyph resize widgets change position
                glyphEditor.$onResize(function resizeCallback(start, end) {

                    $scope.glyphObject.updateVertexFromPixels(0, start.x, start.y);
                    $scope.glyphObject.updateVertexFromPixels(1, end.x, end.y);
                    $scope.glyphObject.render();
                });

                glyphEditor.$onResizeEnd(function saveTelestrations() {

                    telestrationsCtrl.$save();
                });

                // Remove the glyph if the delete widget is clicked
                glyphEditor.$onDeleteClick(function removeGlyph() {
                    telestrationsCtrl.currentTelestration.glyphs.remove($scope.glyphObject);
                    telestrationsCtrl.$updated();
                    telestrationsCtrl.$save();
                });
            });

            // Glyph Start Move

            $scope.glyphObject.onDragStart(function hideGlyphEditor() {

                glyphEditor.$hide();
            });

            // Glyph Finished Moving

            $scope.glyphObject.onDragEnd(function saveTelestrations(delta) {

                telestrationsCtrl.$save();
            });

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on('fullscreen', resetGlyphContext);

            /* Cleanup on Destroy */

            elem.on('$destroy', function() {
                glyphEditor.$hide();
                removeEventListeners();
            });
        }
    };
}

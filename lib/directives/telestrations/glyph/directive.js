
module.exports = [
    '$window', 'VideoPlayerEventEmitter', 'TELESTRATION_PERMISSIONS',
    function($window, videoPlayerEventEmitter, TELESTRATION_PERMISSIONS) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            require: ['?^glyphEditor', '^telestrations'],
            link: function($scope, elem, attr, ctrls) {

                /* Initialization */

                var glyphEditor = ctrls[0];
                var telestrationsCtrl = ctrls[1];

                $scope.glyphObject.registerShapeContainerElement(elem);

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

                    $scope.glyphObject.updateEndpointFromPixels(startVertex, EndVertex);
                    $scope.glyphObject.render();
                };


                /* Create Event Handlers */

                // Create Mouse Event Functions for Drawing

                var glyphDrawing = function glyphDrawing(mouseEvent) {

                    var startPoint = $scope.glyphObject.getVertexInPixels(0);

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
                    SVG.off($window, 'click', glyphOutOfFocus);
                };

                // Draggable Constraints Handler

                /* getContraintFn
                 * @param shape - a drawn SVG object
                 */
                var getConstraintFn = function getConstraintFn(shape) {

                    return function isVertexBounded(x, y) {

                        var containerBox = telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect();
                        if (shape) return (x > 0) && (x < containerBox.width - shape.width()) && (y > 0) && (y < containerBox.height - shape.height());
                        else return (x > 0) && (x < containerBox.width) && (y > 0) && (y < containerBox.height);
                    };
                };

                // Handle Glyph Moved

                var movedHandler = function movedHandler(delta) {

                    $scope.glyphObject.getVerticesInPixels().forEach(function(vertex, index) {
                        var pixelX = vertex.x + delta.x;
                        var pixelY = vertex.y + delta.y;
                        $scope.glyphObject.updateVertexFromPixels(index, pixelX, pixelY);

                        // NOTE: HACK for TEXTBOX. PLEASE FIX.
                        $scope.glyphObject.render();
                    });
                    telestrationsCtrl.$save();
                };

                // Remove Event Listeners

                var removeEventListeners = function removeEventListeners() {

                    telestrationsCtrl.telestrationContainerElement.off('mouseleave', glyphDrawOutOfBounds);
                    telestrationsCtrl.telestrationContainerElement.off('mousemove', glyphDrawing);
                    telestrationsCtrl.telestrationContainerElement.off('mouseup', glyphDrawEnd);

                    SVG.off($window, 'click', glyphOutOfFocus);
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
                    $scope.glyphObject.setDraggableConstraintFn(getConstraintFn($scope.glyphObject.getShapeContext()));
                    glyphEditor.$setDraggableConstraintFn(getConstraintFn());
                }

                // Glyph Text Changed

                $scope.glyphObject.onTextChanged(function(updatedTextObj) {

                    var containerDimensions = telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect();
                    var offsetX = updatedTextObj.dimensions.width;
                    var offsetY = updatedTextObj.dimensions.height;
                    var startPoint = {};
                    var endPoint = {};
                    startPoint.x = updatedTextObj.dimensions.left - containerDimensions.left;
                    startPoint.y = updatedTextObj.dimensions.top - containerDimensions.top;
                    endPoint.x = startPoint.x + offsetX;
                    endPoint.y = startPoint.y + offsetY;

                    $scope.glyphObject.updateVertexFromPixels(0, startPoint.x, startPoint.y);
                    $scope.glyphObject.updateVertexFromPixels(1, endPoint.x, endPoint.y);
                    $scope.glyphObject.setText(updatedTextObj.text);
                    $scope.glyphObject.render();
                });

                // Glyph Clicked

                $scope.glyphObject.onClick(function(event) {

                    event.stopPropagation();

                    // hide glyph editor if you click out of glyph
                    SVG.on($window, 'click', glyphOutOfFocus);

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

                    glyphEditor.$onResizeEnd(function saveTelestration() {

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

                $scope.glyphObject.onMoveStart(function() {
                    glyphEditor.$hide();
                });

                // Glyph Finished Moving

                $scope.glyphObject.onMoved(movedHandler);

                // Reset Glyph and Editor Contexts on Window Resize

                angular.element($window).bind('resize', resetGlyphContext);
                videoPlayerEventEmitter.on('fullscreen', resetGlyphContext);

                /* Cleanup on Destroy */

                elem.on('$destroy', function() {
                    glyphEditor.$hide();
                    removeEventListeners();
                });
            }
        };
    }
];

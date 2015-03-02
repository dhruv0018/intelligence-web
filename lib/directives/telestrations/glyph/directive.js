
module.exports = [
    '$window',
    function($window) {
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

                if (!telestrationsCtrl.isEditable) {
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

                var containerX = function() { return telestrationsCtrl.telestrationContainerElement[0].getBoundingClientRect().left; };
                var containerY = function() { return telestrationsCtrl.telestrationContainerElement[0].getBoundingClientRect().top; };

                var glyphUpdate = function glyphUpdate(startVertex, EndVertex) {

                    $scope.glyphObject.updateGlyphFromPixels(startVertex, EndVertex);
                    $scope.glyphObject.render();
                };


                /* Create Event Handlers */

                // Create Mouse Event Functions for Drawing

                var glyphDrawing = function glyphDrawing(mouseEvent) {

                    if (!telestrationsCtrl.isActive || !telestrationsCtrl.isEditable) return;

                    var startPoint = $scope.glyphObject.getVertexInPixels(0);

                    if (startPoint) {

                        var startRelativePixelX = mouseEvent.x - containerX();
                        var startRelativePixelY = mouseEvent.y - containerY();

                        glyphUpdate(startRelativePixelX, startRelativePixelY);
                    }
                };

                var glyphDrawEnd = function glyphDrawEnd(mouseEvent) {

                    if (!telestrationsCtrl.isActive || !telestrationsCtrl.isEditable) return;

                    if ($scope.glyphObject.hasVertices()) {

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
                    telestrationsCtrl.telestrationContainerElement.unbind('mouseleave', glyphDrawOutOfBounds);
                    SVG.off($window, 'mousemove', glyphDrawing);
                    SVG.off($window, 'mouseup', glyphDrawEnd);
                };

                var glyphDrawOutOfBounds = function glyphDrawOutOfBounds() {

                    SVG.off($window, 'mousemove', glyphDrawing);
                    SVG.off($window, 'mouseup', glyphDrawEnd);
                    telestrationsCtrl.telestrationContainerElement.unbind('mouseleave', glyphDrawOutOfBounds);
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

                    return function getConstraints(x, y) {

                        var containerBox = telestrationsCtrl.telestrationContainerElement[0].getBoundingClientRect();
                        if (shape) return (x > 0) && (x < containerBox.width - shape.width()) && (y > 0) && (y < containerBox.height - shape.height());
                        else return (x > 0) && (x < containerBox.width) && (y > 0) && (y < containerBox.height);
                    };
                };

                // Remove Event Listeners

                var removeEventListeners = function removeEventListeners() {
                    telestrationsCtrl.telestrationContainerElement.unbind('mouseleave', glyphDrawOutOfBounds);
                    SVG.off($window, 'mousemove', glyphDrawing);
                    SVG.off($window, 'mouseup', glyphDrawEnd);
                    SVG.off($window, 'click', glyphOutOfFocus);
                    $window.removeEventListener('resize', resetGlyphContext);
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


                /* Register Listeners and Bind Handlers */

                // Drawing a Glyph

                if (telestrationsCtrl.isDrawing) {
                    SVG.on($window, 'mousemove', glyphDrawing);
                    SVG.on($window, 'mouseup', glyphDrawEnd);
                    telestrationsCtrl.telestrationContainerElement.bind('mouseleave', glyphDrawOutOfBounds);
                }

                // Set Glyph and Editor Constraint Function

                if (telestrationsCtrl.isEditable) {
                    $scope.glyphObject.setDraggableConstraintFn(getConstraintFn($scope.glyphObject.getShapeContext()));
                    glyphEditor.$setDraggableConstraintFn(getConstraintFn());
                }

                // Glyph Text Changed

                $scope.glyphObject.onTextChanged(function(updatedTextObj) {

                    var containerDimensions = telestrationsCtrl.telestrationContainerElement[0].getBoundingClientRect();
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


                /* Cleanup on Destroy */

                elem.on('$destroy', function() {
                    glyphEditor.$hide();
                    removeEventListeners();
                });
            }
        };
    }
];

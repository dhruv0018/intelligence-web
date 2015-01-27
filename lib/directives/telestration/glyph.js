require('./glyph-shapes.js');

var Glyph = angular.module('Glyph', [
    'GlyphShapes'
]);

Glyph.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('glyph-editor.html', require('./glyph-editor-template.html'));
    }
]);

Glyph.factory('GlyphFactory', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return function Glyph(glyphType, glyphZIndex) {

            this.type = glyphType || TELESTRATION_TYPES.FREEHAND;
            this.text = 'Enter text here';
            this.color = '#FFFF00';
            this.zIndex = glyphZIndex;
            this.vertices = [];
            var drawingFunction;

            this.draw = function() {
                if (drawingFunction && typeof drawingFunction === 'function') {
                    drawingFunction();
                }
            };

            this.addVertex = function(newVertex) {
                this.vertices.push(newVertex);
            };

            this.updateGlyph = function(newVertex) {
                switch (this.type) {
                    case TELESTRATION_TYPES.ARROW:
                    case TELESTRATION_TYPES.T_BAR:
                    case TELESTRATION_TYPES.CIRCLE:
                    case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    case TELESTRATION_TYPES.CONE:
                    case TELESTRATION_TYPES.TEXT_TOOL:
                        this.vertices[1] = newVertex;
                        break;
                    case TELESTRATION_TYPES.FREEHAND:
                        this.vertices.push(newVertex);
                        break;
                }
            };

            this.toString = function() {
                return this.type + ': ' + JSON.stringify(this.vertices);
            };

            this.registerDrawingFunction = function(drawingFunctionToRegister) {
                drawingFunction = drawingFunctionToRegister;
            };

        };
    }
]);

Glyph.directive('glyphEditor', [
    'TelestrationInterface',
    function(telestrationInterface) {
        var glyphEditor;
        return {
            restrict: 'A',
            scope: true,
            controller: function() {
                var initialized = false;
                var self = this;

                self.$setEditRegion = function $setEditRegion(startVertex, endVertex) {
                    if (!initialized) {
                        initialize();
                    }

                    updateResizeWidgetsPos(startVertex, endVertex);

                    // Move Widgets to Front
                    self.resizeWidgets.each(function iterFn() {
                        this.front();
                    });

                    // Display the glypheditor
                    self.glyphEditor.show();
                };

                self.resize = angular.noop;
                self.$onResize = function $onResize(callback) {
                    self.resize = callback;
                    console.log('resize fn', self.resize);
                };

                self.$hide = function $hide() {
                    self.glyphEditor.hide();
                };

                function initialize() {

                    self.glyphEditor = telestrationInterface.telestrationSVG.set();
                    self.resizeWidgets = telestrationInterface.telestrationSVG.set(); // add a set for the resize widgets

                    // self.moveBox = createMoveBox();
                    self.startResizeWidget = createResizeWidget(); // Create circle?
                    self.endResizeWidget = createResizeWidget(); // Create circle?

                    /* add components to sets */

                    // self.glyphEditor.add(self.moveBox);
                    self.glyphEditor.add(self.startResizeWidget);
                    self.glyphEditor.add(self.endResizeWidget);
                    self.resizeWidgets.add(self.startResizeWidget);
                    self.resizeWidgets.add(self.endResizeWidget);

                    self.glyphEditor.draggable(); // make all components draggable
                    self.glyphEditor.hide(); // hide initially
                    self.glyphEditor.attr({'fill': '#ccc'}); // set editor fill

                    /* Add handlers */

                    // add movebox handlers
                    // self.moveBox.dragstart = moveBoxDragStart;
                    // self.moveBox.dragstart = moveBoxDragMove;

                    // add resizeWidgets specific handlers
                    self.resizeWidgets.each(function iterFn() {
                        this.dragstart = resizeDragStart;
                    });

                    self.startResizeWidget.dragmove = startPointMove;
                    self.endResizeWidget.dragmove = endPointMove;

                    initialized = true;
                }

                function updateResizeWidgetsPos(startVertex, endVertex) {
                    self.startResizeWidget.move(startVertex[0], startVertex[1]);
                    self.endResizeWidget.move(endVertex[0], endVertex[1]);
                }

                function createMoveBox() {

                    var opacity = 0.3;
                    var fill = '#000';
                    var width = 200;
                    var height = 100;

                    // create the svg
                    var moveBox = telestrationInterface.telestrationSVG.rect(width, height)
                        .attr({ fill: fill})
                        .opacity(opacity);

                    return moveBox;
                }

                function createResizeWidget() {
                    var fill = '#f00';
                    var strokeWidth = '3';
                    var strokeColor = '#000';
                    var radius = 30;

                    var widget = telestrationInterface.telestrationSVG.circle(radius)
                        .attr({
                            fill: fill,
                            'stroke-width': strokeWidth,
                            'stroke-color': strokeColor
                        });

                    return widget;
                }

                // function moveBoxDragStart() {
                //     console.log('moveBoxDragStart');
                // }

                // function moveBoxDragMove(delta, event) {
                //     event.stopPropagation();
                //     console.log('moveBoxDragStart');
                // }

                function resizeDragStart() {
                    this.dragStartXPos = this.x();
                    this.dragStartYPos = this.y();
                }

                function startPointMove(delta, event) {
                    event.stopImmediatePropagation();
                    var endResizeWidgetPos = [self.endResizeWidget.x(),  self.endResizeWidget.y()];
                    var startResizeWidgetPos = [this.dragStartXPos + delta.x, this.dragStartYPos + delta.y];
                    console.log('startPointMove', startResizeWidgetPos, endResizeWidgetPos);
                    self.resize(startResizeWidgetPos, endResizeWidgetPos);
                }

                function endPointMove(delta, event) {
                    event.stopImmediatePropagation();
                    var startResizeWidgetPos = [self.startResizeWidget.x(),  self.startResizeWidget.y()];
                    var endResizeWidgetPos = [this.dragStartXPos + delta.x, this.dragStartYPos + delta.y];
                    console.log('endPointMove', startResizeWidgetPos, endResizeWidgetPos);
                    self.resize(startResizeWidgetPos, endResizeWidgetPos);
                }
            },
            link: function glyphEditorLink(scope, elem, attr, controller) {}
        };
    }
]);

Glyph.directive('glyph', [
    'GlyphShapeRenderer', 'TelestrationInterface',
    function(GlyphShapeRenderer, telestrationInterface) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            require: '^glyphEditor',
            link: function(scope, elem, attr, glyphEditor) {

                glyphEditor = glyphEditor || {
                    '$setEditRegion': angular.noop,
                    '$onResize': angular.noop,
                    '$hide': angular.noop
                };

                var thisGlyph = new GlyphShapeRenderer(elem, scope.glyphObject.type);

                thisGlyph.onClick(function() {
                    glyphSelected = true;
                    glyphEditor.$setEditRegion(scope.glyphObject.vertices[0],scope.glyphObject.vertices[1]);
                    glyphEditor.$onResize(function resizeCallback(start, end) {
                        scope.glyphObject.vertices[0] = start;
                        scope.glyphObject.vertices[1] = end;
                        drawGlyph();
                    });
                });

                thisGlyph.onMove(function() {
                    glyphEditor.$hide();
                });

                thisGlyph.onMoved(function(dx, dy) {
                    scope.glyphObject.vertices.forEach(function(vertex) {
                        vertex[0] = vertex[0] + dx;
                        vertex[1] = vertex[1] + dy;
                    });
                });

                var drawGlyph = function drawGlyph() {

                    var vertices = scope.glyphObject.vertices;
                    var startPoint = vertices[0];
                    var endPoint = vertices[1];

                    if (vertices && vertices.length && vertices.length > 1) {

                        // Draw/update the correct shape onto the canvas
                        thisGlyph.render(vertices, scope.glyphObject.color, scope.glyphObject.text);
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);


/* Abstract SVGGlyph extends Abstract Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        function SVGGlyph(type, options, containerElement, SVGContext, shape) {

            this.primarySVGShape = shape;
            this.SVGContext = SVGContext;

            Glyph.call(this, type, options, containerElement);
        }
        angular.inheritPrototype(SVGGlyph, Glyph);

        /* Default Values */

        SVGGlyph.prototype.STROKE_WIDTH = 8;
        SVGGlyph.prototype.DASHED_ARRAY = '2,2';


        /* Getters and Setters */

        SVGGlyph.prototype.getShapeContext = function getShapeContext() {

            if (this.primarySVGShape) return this.primarySVGShape;
        };


        /* Event listeners and handlers */

        SVGGlyph.prototype.addEditHandlers = function addEditHandlers() {

            var self = this;

            if (!self.primarySVGShape) return;

            self.primarySVGShape.on('click', function handleClick(event) {

                self.onClickHandler(event);
            });

            self.addRemoveListenerFunction('click');

        };

        SVGGlyph.prototype.addMoveHandlers = function addMoveHandlers() {

            var self = this;

            if (!self.primarySVGShape) return;

            self.primarySVGShape.draggable();
            self.primarySVGShape.startPosition = null;


            self.primarySVGShape.on('mousedown', function preventDrawing(mouseEvent) {

                // prevent event bubbling
                mouseEvent.stopPropagation();
            });

            self.primarySVGShape.on('mouseover', function addHoverClass(mouseEvent) {

                self.primarySVGShape.addClass('hover');
            });

            self.primarySVGShape.on('mouseout', function removeHoverClass(mouseEvent) {

                self.primarySVGShape.removeClass('hover');
            });

            self.addRemoveListenerFunction('mouseover');
            self.addRemoveListenerFunction('mouseout');
            self.addRemoveListenerFunction('mousedown');

            // dragging handlers

            self.primarySVGShape.dragstart = function dragstart(delta, event) {

                self.startPosition = {x: self.primarySVGShape.x(), y: self.primarySVGShape.y()};

                self.onDragStartHandler();
            };

            self.primarySVGShape.dragend = function dragend(delta, event) {

                self.constrainDelta(delta);

                self.startPosition = null;

                self.updateVerticesPositions(delta);
                self.onDragEndHandler(delta);
            };
        };

        SVGGlyph.prototype.addRemoveListenerFunction = function addRemoveListenerFunction(eventType) {

            var self = this;

            var removeListenerFunction = function removeListenerFunction() {

                self.primarySVGShape.off(eventType);
            };

            self.activeListenerRemovers.push(removeListenerFunction);
        };

        SVGGlyph.prototype.constrainDelta = function constrainDelta(delta) {

            var self = this;

            if (self.constraintFn) {

                var endPosition = {x: self.primarySVGShape.x(), y: self.primarySVGShape.y()};

                delta.x = endPosition.x - self.startPosition.x;
                delta.y = endPosition.y - self.startPosition.y;
            }
        };

        /*
         * SVGGlyph.prototype.setDraggableConstraintFn
         * Updates the current bounding constraintFn for moving a shape.
         * @param constraintFn : function
         */
        SVGGlyph.prototype.setDraggableConstraintFn = function setDraggableConstraintFn(constraintFn) {

            if (this.primarySVGShape && !this.constraintFn) {

                this.constraintFn = constraintFn;
                this.primarySVGShape.draggable(constraintFn);
            }
        };


        /* Manipulate Primary SVG Shape */

        SVGGlyph.prototype.bringToFront = function bringToFront() {

            if (this.primarySVGShape) this.primarySVGShape.front();
        };

        SVGGlyph.prototype.hide = function hide() {

            if (this.primarySVGShape) this.primarySVGShape.hide();
        };

        SVGGlyph.prototype.show = function show() {

            if (this.primarySVGShape) this.primarySVGShape.show();
        };


        /* Cleanup Helper Functions */

        SVGGlyph.prototype.removeListeners = function removeListeners() {

            if (this.primarySVGShape) this.primarySVGShape.fixed();
        };

        SVGGlyph.prototype.destroy = function() {

            if (this.primarySVGShape) this.primarySVGShape.remove();

            Glyph.prototype.destroy.call(this);
        };

        return SVGGlyph;
    }
];

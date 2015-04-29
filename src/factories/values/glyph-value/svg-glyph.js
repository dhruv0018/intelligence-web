
/* Abstract SVGGlyph extends Abstract Glyph */

SVGGlyphValue.$inject = [
    'GlyphValue',
    '$window',
    'TelestrationsEventEmitter',
    'TELESTRATION_EVENTS',
    'TELESTRATION_COLORS'
];

export function SVGGlyphValue(
    Glyph,
    $window,
    TelestrationsEventEmitter,
    TELESTRATION_EVENTS,
    TELESTRATION_COLORS
) {

    function SVGGlyph(type, options, containerElement, SVGContext, shape) {

        this.primarySVGShape = shape;

        this.SVGContext = SVGContext;

        Glyph.call(this, type, options, containerElement);

        this.addSelectStateListeners();
    }
    angular.inheritPrototype(SVGGlyph, Glyph);

    /* Default Values */

    SVGGlyph.prototype.STROKE_WIDTH = 8;
    SVGGlyph.prototype.DASHED_ARRAY = '2,2';
    SVGGlyph.prototype.RESIZABLE = false;


    /* Getters and Setters */

    SVGGlyph.prototype.getShapeContext = function getShapeContext() {

        if (this.primarySVGShape) return this.primarySVGShape;
    };


    /* Event listeners and handlers */

    SVGGlyph.prototype.enterSelectState = function() {

        TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);
        this.primarySVGShape.stroke({'color': TELESTRATION_COLORS.HIGHLIGHT_BLUE()});
    };

    SVGGlyph.prototype.removeSelectState = function() {

        console.log('removeSelectState');
        TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
        this.primarySVGShape.stroke({'color': this.color});
        this.onBlurHandler();
    };

    SVGGlyph.prototype.addSelectStateListeners = function addSelectStateListeners() {

        let self = this;

        self.primarySVGShape.on('mousedown', onSelectedMousedown);

        function onSelectedMousedown (event) {

            if (self.selected) return;

            console.log('onSelectedMousedown');

            // change to select state color
            self.enterSelectState();
            self.selected = true;

            $window.removeEventListener('mouseup', onSelectedMouseup);
            $window.addEventListener('mouseup', onSelectedMouseup);
        }

        function onSelectedMouseup(event) {

            console.log('onSelectedMouseup', event);
            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);

            addSelectStateRemovalListeners();
            $window.removeEventListener('mouseup', onSelectedMouseup);

            self.onSelectedMouseupHandler();
        }

        function selectStateRemovalListener(event) {

            console.log('remove selectStateRemovalListener', event);
            // exit select state if the mouse event did not originate from the primary svg shape
            if (event.target !== self.primarySVGShape.node && self.resizeNodes.indexOf(event.target) === -1) {

                TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);

                self.removeSelectState();
                self.selected = false;

                $window.removeEventListener('mousedown', selectStateRemovalListener);
            }
        }

        function addSelectStateRemovalListeners() {

            console.log('addSelectStateRemovalListeners');
            $window.removeEventListener('mousedown', selectStateRemovalListener);
            $window.addEventListener('mousedown', selectStateRemovalListener);
        }
    };


    SVGGlyph.prototype.addMoveHandlers = function addMoveHandlers() {

        var self = this;

        if (!self.primarySVGShape) return;

        self.primarySVGShape.draggable();
        self.primarySVGShape.startPosition = null;

        self.primarySVGShape.on('mouseover', function addHoverClass(mouseEvent) {

            self.primarySVGShape.addClass('hover');
        });

        self.primarySVGShape.on('mouseout', function removeHoverClass(mouseEvent) {

            self.primarySVGShape.removeClass('hover');
        });

        self.addRemoveListenerFunction('mouseover');
        self.addRemoveListenerFunction('mouseout');

        // dragging handlers

        self.primarySVGShape.dragstart = function dragstart(delta, event) {

            self.startPosition = {x: self.primarySVGShape.x(), y: self.primarySVGShape.y()};

            self.onDragStartHandler();
        };

        self.primarySVGShape.dragend = function dragend(delta, event) {

            self.constrainDelta(delta);

            self.startPosition = null;

            self.updateVerticesPositions(delta);
            self.onSelectedMouseupHandler();
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

module.exports = SVGGlyphValue;

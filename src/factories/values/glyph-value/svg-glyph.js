
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

        this.primarySVGShape.node.setAttribute('class', this.BASE_CLASS);

        this.addStateChangeListeners();
    }
    angular.inheritPrototype(SVGGlyph, Glyph);

    /* Default Values */

    SVGGlyph.prototype.STROKE_WIDTH = 3;
    SVGGlyph.prototype.DASHED_ARRAY = '2,2';
    SVGGlyph.prototype.RESIZABLE = false;


    /* Getters and Setters */

    SVGGlyph.prototype.getShapeContext = function getShapeContext() {

        if (this.primarySVGShape) return this.primarySVGShape;
    };

    /* Event listeners and handlers */

    SVGGlyph.prototype.enterDisplaySelectedModeHook = function() {};

    SVGGlyph.prototype.enterDisplayModeHook = function() {};

    SVGGlyph.prototype.addStateChangeListeners = function addStateChangeListeners() {

        let self = this;

        enterDisplayMode();

        /*
         * Changes styles and handlers for display-text mode.
         * Text Input Handlers are already set.
         */
        function enterDisplayMode(event) {

            // enable draw if the target is not of type textareaGlyph
            let targetClass;

            if (event) targetClass = event.target.getAttribute('class');

            if (!event || !targetClass) {

                TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
                self.onBlurHandler();

            } else if (targetClass && targetClass.split(' ').indexOf(self.BASE_CLASS) === -1) {

                TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
                self.onBlurHandler();
            }

            self.primarySVGShape.on('mousedown', handleDisplayModeToDisplaySelectedModeTransition);

            self.primarySVGShape.stroke({'color': self.color});

            self.enterDisplayModeHook();
        }


        function enterDisplaySelectedMode(event) {

            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);

            $window.addEventListener('mousedown', handleDisplaySelectedModeToDisplayModeTransitionTest);

            self.primarySVGShape.on('mouseup', self.onSelectedMouseupHandler);

            self.primarySVGShape.on('mousedown', handleDisplaySelectedModeToDisplaySelectedModeTransition);

            self.primarySVGShape.stroke({'color': TELESTRATION_COLORS.HIGHLIGHT_BLUE()});

            self.enterDisplaySelectedModeHook();
        }

        function handleDisplaySelectedModeToDisplayModeTransitionTest(event) {

            if (event.target !== self.primarySVGShape.node && self.resizeNodes.indexOf(event.target) === -1) {

                handleDisplaySelectedModeToDisplayModeTransition(event);
            }
        }

        function handleDisplaySelectedModeToDisplaySelectedModeTransition(event) {

            /* handle exiting current state */
            exitDisplaySelectedMode();


            /* handle transition */
            // NOTHING TO DO


            /* go to to next state */
            enterDisplaySelectedMode(event);
        }

        function handleDisplayModeToDisplaySelectedModeTransition(event) {

            /* handle exiting current state */
            exitDisplayMode();


            /* handle transition */
            // NOTHING TO DO


            /* go to to next state */
            enterDisplaySelectedMode(event);
        }

        function handleDisplaySelectedModeToDisplayModeTransition(event) {

            /* handle exiting current state */
            exitDisplaySelectedMode();


            /* handle transition */
            // NOTHING TO DO


            /* go to to next state */
            enterDisplayMode(event);
        }

        function exitDisplayMode() {

            self.primarySVGShape.off('mousedown', handleDisplayModeToDisplaySelectedModeTransition);
        }

        function exitDisplaySelectedMode() {

            self.primarySVGShape.off('mouseup', self.onSelectedMouseupHandler);
            self.primarySVGShape.off('mousedown', handleDisplaySelectedModeToDisplaySelectedModeTransition);
            $window.removeEventListener('mousedown', handleDisplaySelectedModeToDisplayModeTransitionTest);
        }

        function exitEditMode() {

            self.primarySVGShape.off('mousedown', stopEventPropagation);
            $window.removeEventListener('click', handleEditModeToDisplayModeTransitionTest);
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

        self.primarySVGShape.dragmove = function dragmove(delta, event) {

            self.constrainDelta(delta);
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

        Glyph.prototype.removeListeners.call(this);
        if (this.primarySVGShape) this.primarySVGShape.fixed();
    };

    SVGGlyph.prototype.destroy = function() {

        if (this.primarySVGShape) this.primarySVGShape.remove();

        Glyph.prototype.destroy.call(this);
    };

    return SVGGlyph;
}

module.exports = SVGGlyphValue;

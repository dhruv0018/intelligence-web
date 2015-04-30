
module.exports = GlyphEditorController;

GlyphEditorController.$inject = [
    '$scope',
    '$element',
    'TELESTRATION_COLORS'
];

function GlyphEditorController(
    $scope,
    $element,
    TELESTRATION_COLORS
) {

    var initialized = false;
    var self = this;

    /* Initialize */
    var telestrationsController = $element.inheritedData('$telestrationsController');


    self.widgetRadius = 24;
    self.resizeWidgetCenterOffset = -self.widgetRadius / 2;

    self.setEditRegion = function setEditRegion(startVertex, endVertex) {

        if (!initialized) throw new Error('Glyph Editor not initialized');


        updateResizeWidgetsPos(startVertex, endVertex);

        // Move Widgets to Front
        self.startResizeWidget.front();
        self.endResizeWidget.front();

        // Display the glypheditor
        self.startResizeWidget.show();
        self.endResizeWidget.show();
    };

    self.resize = angular.noop;
    self.onResize = function onResize(callback) {
        self.resize = callback;
    };

    self.resizeEnded = angular.noop;
    self.onResizeEnd = function onResizeEnd(callback) {
        self.resizeEnded = callback;
    };

    self.resizeStarted = angular.noop;
    self.onResizeStart = function onResizeStart(callback) {
        self.resizeStarted = callback;
    };

    self.hide = function hide() {

        if (!initialized) throw new Error('Glyph Editor not initialized');

        self.startResizeWidget.hide();
        self.endResizeWidget.hide();
    };

    self.getNodes = function getNodes() {

        if (initialized) return [self.startResizeWidget.node, self.endResizeWidget.node];
    };

    /*
     * Updates the current bounding constraintFn for moving the glyph editor widgets.
     * @param constraintFn : function
     */
    self.setDraggableConstraintFn = function glyphEditorSetDraggableConstraintFn(constraintFn) {
        if (!initialized) {
            throw new Error('Glyph Editor not initialized');
        }
        if (constraintFn && !self.constraintFn) {
            self.constraintFn = constraintFn;
            self.startResizeWidget.draggable(constraintFn);
            self.endResizeWidget.draggable(constraintFn);
        }
    };

    self.initialize = function initialize() {
        // Glyph Editor operates as a Singleton, don't initialize more than once.
        if (initialized) return;

        /* create resize/rotate widgets */
        self.startResizeWidget = createResizeWidget();
        self.endResizeWidget = createResizeWidget();

        /* Add resize widget handlers */
        self.startResizeWidget.dragstart = resizeDragStart;
        self.endResizeWidget.dragstart = resizeDragStart;
        self.startResizeWidget.dragmove = startPointMove;
        self.endResizeWidget.dragmove = endPointMove;
        self.startResizeWidget.dragend = resizeDragEnd;
        self.endResizeWidget.dragend = resizeDragEnd;

        self.startResizeWidget.on('mouseover', function() {
            this.addClass('hover');
        });
        self.startResizeWidget.on('mouseout', function() {
            this.removeClass('hover');
        });
        self.endResizeWidget.on('mouseover', function() {
            this.addClass('hover');
        });
        self.endResizeWidget.on('mouseout', function() {
            this.removeClass('hover');
        });

        initialized = true;

        self.hide();
    };

    function updateResizeWidgetsPos(startVertex, endVertex) {
        // center the position about the start and end vertex
        var startX = startVertex.x + self.resizeWidgetCenterOffset;
        var startY = startVertex.y + self.resizeWidgetCenterOffset;
        var endX = endVertex.x + self.resizeWidgetCenterOffset;
        var endY = endVertex.y + self.resizeWidgetCenterOffset;

        self.startResizeWidget.move(startX, startY);
        self.endResizeWidget.move(endX, endY);
    }

    function createResizeWidget() {
        var fill = TELESTRATION_COLORS.HIGHLIGHT_BLUE();
        var strokeColor = TELESTRATION_COLORS.BORDER_GRAY();
        var radius = self.widgetRadius;
        var widget = telestrationsController.telestrationSVG.circle(radius)
            .attr({
                fill: fill,
                'stroke-color': strokeColor,
                'stroke-width': 1
            });

        return widget;
    }

    function resizeDragStart() {

        this.dragStartPos = {x: this.x(), y: this.y()};
        this.front();
        self.resizeStarted();
    }

    function resizeDragEnd() {

        self.resizeEnded();
    }

    function startPointMove(delta, event) {

        constrainDelta(delta, this);

        // remove widget offset from points
        var startX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
        var startY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;
        var endX = self.endResizeWidget.x() - self.resizeWidgetCenterOffset;
        var endY = self.endResizeWidget.y() - self.resizeWidgetCenterOffset;

        var startResizeWidgetPos = {x: startX, y: startY};
        var endResizeWidgetPos = {x: endX, y: endY};

        self.resize(startResizeWidgetPos, endResizeWidgetPos);
    }

    function endPointMove(delta, event) {

        constrainDelta(delta, this);

        // remove widget offset from points for callback
        var startX = self.startResizeWidget.x() - self.resizeWidgetCenterOffset;
        var startY = self.startResizeWidget.y() - self.resizeWidgetCenterOffset;
        var endX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
        var endY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;

        var startResizeWidgetPos = {x: startX, y: startY};
        var endResizeWidgetPos = {x: endX, y: endY};

        self.resize(startResizeWidgetPos, endResizeWidgetPos);
    }

    function constrainDelta(delta, resizeWidget) {
        if (self.constraintFn) {

            var endPosition = {x: resizeWidget.x(), y: resizeWidget.y()};

            delta.x = endPosition.x - resizeWidget.dragStartPos.x;
            delta.y = endPosition.y - resizeWidget.dragStartPos.y;
        }
        return delta;
    }
}

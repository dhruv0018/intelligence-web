
module.exports = GlyphEditorController;

GlyphEditorController.$inject = ['$scope', '$element'];

function GlyphEditorController($scope, $element) {

    var initialized = false;
    var self = this;
    var deleteWidgetClickCallback = angular.noop;

    /* Initialize */
    var telestrationsController = $element.inheritedData('$telestrationsController');

    $scope.isEnabled = false;

    self.widgetRadius = 30;
    self.resizeWidgetCenterOffset = -self.widgetRadius / 2;

    self.$setEditRegion = function $setEditRegion(startVertex, endVertex) {

        if (!initialized) throw new Error('Glyph Editor not initialized');

        $scope.isEnabled = true;

        updateResizeWidgetsPos(startVertex, endVertex);

        // Move Widgets to Front
        self.startResizeWidget.front();
        self.endResizeWidget.front();

        // Display the glypheditor
        // TODO: Uncomment when want to add the resize functionality
        // self.startResizeWidget.show();
        // self.endResizeWidget.show();
    };

    self.resize = angular.noop;
    self.$onResize = function $onResize(callback) {
        self.resize = callback;
    };

    self.resizeEnded = angular.noop;
    self.$onResizeEnd = function $onResizeEnd(callback) {
        self.resizeEnded = callback;
    };

    self.$hide = function $hide() {

        if (!initialized) throw new Error('Glyph Editor not initialized');

        $scope.isEnabled = false;

        self.startResizeWidget.hide();
        self.endResizeWidget.hide();
    };

    /*
     * Updates the current bounding constraintFn for moving the glyph editor widgets.
     * @param constraintFn : function
     */
    self.$setDraggableConstraintFn = function glyphEditorSetDraggableConstraintFn(constraintFn) {
        if (!initialized) {
            throw new Error('Glyph Editor not initialized');
        }
        if (constraintFn && !self.constraintFn) {
            self.constraintFn = constraintFn;
            self.startResizeWidget.draggable(constraintFn);
            self.endResizeWidget.draggable(constraintFn);
        }
    };

    self.$initialize = function $initialize() {
        // Glyph Editor operates as a Singleton, don't initialize more than once.
        if (initialized) return;

        /* create resize/rotate widgets */
        self.startResizeWidget = createResizeWidget();
        self.endResizeWidget = createResizeWidget();

        var deleteElement = $element.find('delete-button');
        self.deleteWidget = angular.element(deleteElement);

        /* Add resize widget handlers */
        self.startResizeWidget.dragstart = resizeDragStart;
        self.endResizeWidget.dragstart = resizeDragStart;
        self.startResizeWidget.dragmove = startPointMove;
        self.endResizeWidget.dragmove = endPointMove;
        self.startResizeWidget.dragend = resizeDragEnd;
        self.endResizeWidget.dragend = resizeDragEnd;

        initialized = true;

        self.$hide();
    };

    self.$onDeleteClick = function $onDeleteClick(callback) {

        deleteWidgetClickCallback = callback;
    };

    $scope.deleteWidgetClick = function deleteWidgetClick(event) {

        deleteWidgetClickCallback();
        $scope.isEnabled = false;
    };

    function updateResizeWidgetsPos(startVertex, endVertex) {
        // center the position about the start and end vertex
        var startX = startVertex.x + self.resizeWidgetCenterOffset;
        var startY = startVertex.y + self.resizeWidgetCenterOffset;
        var endX = endVertex.x + self.resizeWidgetCenterOffset;
        var endY = endVertex.y + self.resizeWidgetCenterOffset;

        self.startResizeWidget.move(startX, startY);
        self.endResizeWidget.move(endX, endY);

        /* position the delete widget between the start and end vertices */
        moveDeleteWidget();
    }

    function moveDeleteWidget() {
        var startX = self.startResizeWidget.x();
        var startY = self.startResizeWidget.y();
        var endX = self.endResizeWidget.x();
        var endY = self.endResizeWidget.y();

        var resizeDeltaX = Math.abs(endX - startX);
        var resizeDeltaY = Math.abs(endY - startY);
        var deleteWidgetX = (startX <= endX ? startX : endX) + (resizeDeltaX / 2);
        var deleteWidgetY = (startY <= endY ? startY : endY) + (resizeDeltaY / 2);

        self.deleteWidget.css({'left': deleteWidgetX + 'px', 'top': deleteWidgetY + 'px'});
    }

    function createMoveBox() {

        var opacity = 0.3;
        var fill = '#000';
        var width = 200;
        var height = 100;

        // create the svg
        var moveBox = telestrationsController.telestrationSVG.rect(width, height)
            .attr({ fill: fill})
            .opacity(opacity);

        return moveBox;
    }

    function createResizeWidget() {
        var fill = '#cecece';
        var strokeWidth = '1';
        var strokeColor = '#ccc';
        var radius = self.widgetRadius;

        var widget = telestrationsController.telestrationSVG.circle(radius)
            .attr({
                fill: fill,
                'stroke-width': strokeWidth,
                'stroke-color': strokeColor
            });

        return widget;
    }

    function resizeDragStart() {
        this.dragStartPos = {x: this.x(), y: this.y()};
        this.front();
    }

    function resizeDragEnd() {
        this.resizeEnded();
    }

    function startPointMove(delta, event) {
        event.stopImmediatePropagation();
        constrainDelta(delta, this);

        // remove widget offset from points
        var startX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
        var startY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;
        var endX = self.endResizeWidget.x() - self.resizeWidgetCenterOffset;
        var endY = self.endResizeWidget.y() - self.resizeWidgetCenterOffset;

        var startResizeWidgetPos = {x: startX, y: startY};
        var endResizeWidgetPos = {x: endX, y: endY};

        self.resize(startResizeWidgetPos, endResizeWidgetPos);

        moveDeleteWidget();
    }

    function endPointMove(delta, event) {
        event.stopImmediatePropagation();
        constrainDelta(delta, this);

        // remove widget offset from points for callback
        var startX = self.startResizeWidget.x() - self.resizeWidgetCenterOffset;
        var startY = self.startResizeWidget.y() - self.resizeWidgetCenterOffset;
        var endX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
        var endY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;

        var startResizeWidgetPos = {x: startX, y: startY};
        var endResizeWidgetPos = {x: endX, y: endY};

        self.resize(startResizeWidgetPos, endResizeWidgetPos);

        moveDeleteWidget();
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

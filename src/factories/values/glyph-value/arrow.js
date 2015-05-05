
/* Arrow SVGGlyph - extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        function Arrow(type, options, containerElement, SVGContext) {

            SVGGlyph.call(this, type, options, containerElement, SVGContext, SVGContext.path());

            this.addMoveHandlers();
        }
        angular.inheritPrototype(Arrow, SVGGlyph);

        Arrow.prototype.RESIZABLE = true;
        Arrow.prototype.ARROW_SIDE_LENGTH = 10;
        Arrow.prototype.ARROW_HEIGHT = Math.sqrt(5 / 4 * Math.pow(Arrow.prototype.ARROW_SIDE_LENGTH, 2));

        Arrow.prototype.renderShape = function renderShape() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('Arrow render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the arrowhead
            var m1 = ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            //3 points (x,y) for the arrowhead
            var arrowTip = [];
            var arrowBase1 = [];
            var arrowBase2 = [];
            if (endPoint.x - startPoint.x >= 0) {
                arrowTip[0] = endPoint.x + this.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y + this.ARROW_HEIGHT * dy1;
            } else {
                arrowTip[0] = endPoint.x - this.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y - this.ARROW_HEIGHT * dy1;
            }
            arrowBase1[0] = endPoint.x - (this.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase1[1] = endPoint.y - (this.ARROW_SIDE_LENGTH / 2) * dy;
            arrowBase2[0] = endPoint.x + (this.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase2[1] = endPoint.y + (this.ARROW_SIDE_LENGTH / 2) * dy;

            this.primarySVGShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z');
        };

        Arrow.prototype.renderAttributes = function renderAttributes() {

            let attributes = {
                fill: this.color,
                stroke: this.color,
                'stroke-width': this.STROKE_WIDTH,
                'stroke-dasharray': this.dashedArray
            };

            this.primarySVGShape.attr(attributes);
        };

        Arrow.prototype.render = function renderArrow() {

            this.renderShape();
            this.renderAttributes();
        };

        return Arrow;
    }
];

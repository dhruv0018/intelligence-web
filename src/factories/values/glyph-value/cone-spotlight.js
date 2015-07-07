
/* Cone Spotlight - extends Spotlight */

module.exports = [
    'SpotlightValue',
    function(Spotlight) {

        function ConeSpotlight(type, options, containerElement, SVGContext) {

            Spotlight.call(this, type, options, containerElement, SVGContext, SVGContext.path(), SVGContext.path());

            this.primarySVGShape.opacity(0);

            this.addMoveHandlers();
        }
        angular.inheritPrototype(ConeSpotlight, Spotlight);

        ConeSpotlight.prototype.RESIZABLE = true;

        ConeSpotlight.prototype.renderShape = function renderShape() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('ConeSpotlight render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the opening
            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            var m1 = (offsetY / offsetX);
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            var pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
            var coneOpeningWidth = pointDistance / 2;

            //2 points (x,y) for the cone structure
            var conePoint1 = [];
            var conePoint2 = [];

            //3 points for the bezier curve
            var extensionPoint = [];
            var curveReferencePoint1 = [];
            var curveReferencePoint2 = [];

            offsetX = offsetX || Math.sign(offsetY); //fix for offsetX of 0

            if (offsetX > 0) {
                extensionPoint[0] = endPoint.x - (coneOpeningWidth / 5) * dx1;
                extensionPoint[1] = endPoint.y - (coneOpeningWidth / 5) * dy1;
            } else {
                extensionPoint[0] = endPoint.x + (coneOpeningWidth / 5) * dx1;
                extensionPoint[1] = endPoint.y + (coneOpeningWidth / 5) * dy1;
            }

            conePoint1[0] = extensionPoint[0] - (coneOpeningWidth / 2) * dx;
            conePoint1[1] = extensionPoint[1] - (coneOpeningWidth / 2) * dy;
            conePoint2[0] = extensionPoint[0] + (coneOpeningWidth / 2) * dx;
            conePoint2[1] = extensionPoint[1] + (coneOpeningWidth / 2) * dy;

            curveReferencePoint1[0] = endPoint.x - (coneOpeningWidth / 4) * dx;
            curveReferencePoint1[1] = endPoint.y - (coneOpeningWidth / 4) * dy;
            curveReferencePoint2[0] = endPoint.x + (coneOpeningWidth / 4) * dx;
            curveReferencePoint2[1] = endPoint.y + (coneOpeningWidth / 4) * dy;

            this.spotlight.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z');

            this.primarySVGShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z');
        };

        ConeSpotlight.prototype.renderAttributes = function renderAttributes() {

            this.primarySVGShape.opacity(0);
        };

        ConeSpotlight.prototype.render = function renderConeSpotlight() {

            this.renderShape();
            this.renderAttributes();
        };

        return ConeSpotlight;
    }
];

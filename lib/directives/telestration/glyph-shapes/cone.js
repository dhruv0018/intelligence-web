angular.module('GlyphShapes.ConeShape', []).factory('ConeFactory', [
    'TelestrationInterface', 'ShadowShapeFactory',
    function(telestrationInterface, ShadowShape) {

        function Cone() {

            ShadowShape.call(this);

            this.currentShape = telestrationInterface.telestrationSVG.path().opacity(0);
            this.spotShadow = telestrationInterface.telestrationSVG.path();
            var theMask = ShadowShape.prototype.addShadow(this.spotShadow);
        }
        angular.inheritPrototype(Cone, ShadowShape);

        Cone.prototype.render = function renderCone(vertices, color, text) {

            var startPoint = vertices[0];
            var endPoint = vertices[1];

            //Calculate the opening
            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            var m1 = (offsetY / offsetX);
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
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
                extensionPoint[0] = endPoint[0] - (coneOpeningWidth / 5) * dx1;
                extensionPoint[1] = endPoint[1] - (coneOpeningWidth / 5) * dy1;
            } else {
                extensionPoint[0] = endPoint[0] + (coneOpeningWidth / 5) * dx1;
                extensionPoint[1] = endPoint[1] + (coneOpeningWidth / 5) * dy1;
            }

            conePoint1[0] = extensionPoint[0] - (coneOpeningWidth / 2) * dx;
            conePoint1[1] = extensionPoint[1] - (coneOpeningWidth / 2) * dy;
            conePoint2[0] = extensionPoint[0] + (coneOpeningWidth / 2) * dx;
            conePoint2[1] = extensionPoint[1] + (coneOpeningWidth / 2) * dy;

            curveReferencePoint1[0] = endPoint[0] - (coneOpeningWidth / 4) * dx;
            curveReferencePoint1[1] = endPoint[1] - (coneOpeningWidth / 4) * dy;
            curveReferencePoint2[0] = endPoint[0] + (coneOpeningWidth / 4) * dx;
            curveReferencePoint2[1] = endPoint[1] + (coneOpeningWidth / 4) * dy;

            this.spotShadow.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z');

            this.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                .attr({
                    fill: color || this.defaultColor,
                    stroke: color || this.defaultColor,
                    'stroke-width': this.BORDER_WIDTH
                });
        };

        Cone.prototype.destroy = function() {

            ShadowShape.prototype.destroy.call(this);

            this.spotShadow.remove();
        };

        return Cone;
    }
]);

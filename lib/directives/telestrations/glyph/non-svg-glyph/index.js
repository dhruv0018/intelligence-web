
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

// Directive
Telestrations.directive('nonSvgGlyph', NonSvgGlyph);

NonSvgGlyph.$inject = ['$window', 'VideoPlayerEventEmitter', 'TELESTRATION_PERMISSIONS'];

function NonSvgGlyph($window, videoPlayerEventEmitter, TELESTRATION_PERMISSIONS) {
    return {
        restrict: 'E',
        scope: true,
        require: ['?^glyphEditor', '^telestrations'],
        link: function($scope, elem, attr, ctrls) {

            $scope.glyphObject.render();
            /* Initialization */
            var glyphEditor = ctrls[0];
            var telestrationsCtrl = ctrls[1];

            if (telestrationsCtrl.permissions !== TELESTRATION_PERMISSIONS.EDIT) {
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

            var containerX = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().top; };


            // Window Resize Handlers

            // TODO: implement functions
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

            // Remove Event Listeners

            var removeEventListeners = function removeEventListeners() {

                telestrationsCtrl.telestrationContainerElement.off('mouseleave', glyphDrawOutOfBounds);
                telestrationsCtrl.telestrationContainerElement.off('mousemove', glyphDrawing);
                telestrationsCtrl.telestrationContainerElement.off('mouseup', glyphDrawEnd);

                $window.removeEventListener('click', glyphOutOfFocus);
                $window.removeEventListener('resize', resetGlyphContext);
                videoPlayerEventEmitter.removeListener('fullscreen', resetGlyphContext);
            };


            /* Register Listeners and Bind Handlers */

            // Glyph Clicked

            $scope.glyphObject.onClick(function(event) {

                event.stopPropagation();

                // hide glyph editor if you click out of glyph
                $window.addEventListener('click', glyphOutOfFocus);

                // Bring glyph to the front of the context
                // TODO: Implement function
                // $scope.glyphObject.bringToFront();

                // Remove the glyph if the delete widget is clicked
                glyphEditor.$onDeleteClick(function removeGlyph() {
                    telestrationsCtrl.currentTelestration.glyphs.remove($scope.glyphObject);
                    telestrationsCtrl.$updated();
                    telestrationsCtrl.$save();
                });
            });

            // Glyph Start Move

            // TODO: Implement function
            $scope.glyphObject.onDragStart(function hideGlyphEditor() {

                glyphEditor.$hide();
            });

            // Glyph Finished Moving
            // TODO: Implement function
            $scope.glyphObject.onDragEnd(function saveTelestrations(delta) {

                telestrationsCtrl.$save();
            });

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on('fullscreen', resetGlyphContext);

            /* Cleanup on Destroy */

            // TODO: Implement functions
            elem.on('$destroy', function() {
                // glyphEditor.$hide();
                // removeEventListeners();
            });
        }
    };
}

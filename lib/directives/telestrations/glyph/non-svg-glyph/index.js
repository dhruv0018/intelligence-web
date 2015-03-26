
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


            /* Register Listeners and Bind Handlers */

            $scope.glyphObject.onClick(focusOnGlyph);
            $scope.glyphObject.onDragStart(hideGlyphEditor);
            $scope.glyphObject.onDragEnd(saveTelestrations);
            $scope.glyphObject.onTextChanged(saveTelestrations);

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on('fullscreen', resetGlyphContext);


            /* Helpers */

            var containerX = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationsCtrl.telestrationSVGContainer[0].getBoundingClientRect().top; };


            /* Define Handlers */

            function resetGlyphContext() {

                glyphEditor.$hide();
                $scope.glyphObject.render();
            }

            function glyphOutOfFocus(event) {
                console.log('glyphOutOfFocus');
                glyphEditor.$hide();
                $window.removeEventListener('click', glyphOutOfFocus);
            }

            function saveTelestrations(delta) {
                console.log('saveTelestrations');
                telestrationsCtrl.$save();
            }

            function hideGlyphEditor() {
                console.log('hideGlyphEditor');
                glyphEditor.$hide();
            }

            function focusOnGlyph(event) {

                event.stopPropagation();
                console.log('focusOnGlyph');
                // hide glyph editor if you click out of glyph
                $window.addEventListener('click', glyphOutOfFocus);

                // Bring glyph to the front of the contextgs
                // TODO: Implement function
                // $scope.glyphObject.bringToFront();

                // Remove the glyph if the delete widget is clicked
                glyphEditor.$onDeleteClick(function removeGlyph() {
                    telestrationsCtrl.currentTelestration.glyphs.remove($scope.glyphObject);
                    telestrationsCtrl.$updated();
                    telestrationsCtrl.$save();
                });
            }

            function removeEventListeners() {

                $window.removeEventListener('click', glyphOutOfFocus);
                $window.removeEventListener('resize', resetGlyphContext);
                videoPlayerEventEmitter.removeListener('fullscreen', resetGlyphContext);
            }


            /* Cleanup on Destroy */

            elem.on('$destroy', function() {
                glyphEditor.$hide();
                removeEventListeners();
            });
        }
    };
}


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
        link: function(scope, element, attributes, controllers) {

            scope.glyphObject.render();
            /* Initialization */
            var glyphEditor = controllers[0];
            var telestrationsController = controllers[1];

            if (telestrationsController.permissions !== TELESTRATION_PERMISSIONS.EDIT) {
                glyphEditor = null;
                scope.glyphObject.removeListeners();
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
            telestrationsController.$updated();

            /* Register Listeners and Bind Handlers */

            scope.glyphObject.onClick(focusOnGlyph);
            scope.glyphObject.onDragStart(dragStart);
            scope.glyphObject.onDragEnd(dragEnd);
            scope.glyphObject.onTextChanged(textChanged);

            // Reset Glyph and Editor Contexts on Window Resize

            $window.addEventListener('resize', resetGlyphContext);
            videoPlayerEventEmitter.on('fullscreen', resetGlyphContext);


            /* Helpers */

            var containerX = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().top; };


            /* Define Handlers */

            function dragEnd() {

                telestrationsController.$save();
            }

            function textChanged() {

                telestrationsController.$save();
            }

            function resetGlyphContext() {

                glyphEditor.$hide();
                scope.glyphObject.render();
            }

            function glyphOutOfFocus(event) {

                telestrationsController.selectedGlyph = undefined;
                glyphEditor.$hide();
                $window.removeEventListener('click', glyphOutOfFocus);
            }

            function dragStart() {

                glyphEditor.$hide();
            }

            function focusOnGlyph(event) {

                event.stopPropagation();

                telestrationsController.selectedGlyph = scope.glyphObject;

                // hide glyph editor if you click out of glyph
                $window.addEventListener('click', glyphOutOfFocus);

                // Bring glyph to the front of the contextgs
                // TODO: Implement function
                // scope.glyphObject.bringToFront();

                // Remove the glyph if the delete widget is clicked
                glyphEditor.$onDeleteClick(function removeGlyph() {
                    telestrationsController.currentTelestration.glyphs.remove(scope.glyphObject);
                    telestrationsController.$updated();
                    telestrationsController.$save();
                });
            }

            function removeEventListeners() {

                $window.removeEventListener('click', glyphOutOfFocus);
                $window.removeEventListener('resize', resetGlyphContext);
                videoPlayerEventEmitter.removeListener('fullscreen', resetGlyphContext);
            }


            /* Cleanup on Destroy */

            element.on('$destroy', function() {
                glyphEditor.$hide();
                removeEventListeners();
            });
        }
    };
}

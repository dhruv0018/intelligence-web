var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Draggable
 * @module Draggable
 */
var Draggable = angular.module('Draggable', []);

/**
 * Draggable directive.
 * @module Draggable
 * @name Draggable
 * @type {Directive}
 * Rearranges a sortOrder list based on draggable items
 */
Draggable.directive('draggable',
    function() {

        var dragIndex;
        var dragstartClass = 'moving';

        var directive = {
            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, elem, attrs) {

            $scope.$watch(attrs.draggable, function(value) {
                if (!value) {
                    elem.removeClass('active');
                    elem.attr('draggable', false);
                } else {
                    elem.addClass('active');
                    elem.attr('draggable', true);
                }
            });

            var dragstart = function(event) {
                elem.addClass(dragstartClass);
                dragIndex = $scope.$index;
            };

            var dragover = function(event) {
                if (event.preventDefault) {
                    event.preventDefault(); // Necessary. Allows us to drop.
                }
                event.dataTransfer.dropEffect = 'move';
            };

            // handles the re-ordering of items
            var dragenter = function(event) {
                var to = $scope.$index;
                var from = dragIndex;

                /* Remove the item from its current index in the collection and store it. */
                var move = $scope.sortOrder.splice(from, 1).pop();

                /* Insert the moved item into the new location in the sortOrder. */
                $scope.sortOrder.splice(to, 0, move);

                dragIndex = to;

                $scope.$apply();
            };

            var dragend = function(event) {
                this.classList.remove(dragstartClass);
            };

            elem.bind('dragstart', dragstart);
            elem.bind('dragover', dragover);
            elem.bind('dragenter', dragenter);
            elem.bind('dragend', dragend);
        }

        return directive;
    }
);

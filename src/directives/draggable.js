var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * @module IntelligenceWebClient
 * @name draggable
 * @type {directive}
 * @kind attribute
 */
IntelligenceWebClient.directive('draggable',
    function() {

        var dragIndex;
        var dragImage;
        var dragClass = 'active';

        var directive = {
            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes) {

            $scope.isDragging = false;
            var expression = attributes.ngRepeat;

            /* Find the collection in the expression. */
            var collection = expression.match(/in\s+([\s\S]+?)?$/)[1];

            $scope.$watch(collection, function(collection) {

                $scope.collection = collection;
            });

            //flag that can turn the ability to drag off/on
            //allow dragging if flag not used
            if (!('draggableFlag' in attributes)) {
                element.attr('draggable', true);
            } else {
                attributes.$observe('draggableFlag', function(newValue) {
                    element.attr('draggable', newValue === 'true');
                });
            }


            dragImage = document.createElement('img');
            dragImage.src = 'assets/move.png';

            element.attr('draggable', true);

            element.bind('mousedown', dragstart);
            element.bind('mouseup', dragend);

            element.bind('dragover', dragover);
            element.bind('dragenter', dragenter);
            element.bind('dragleave', dragleave);

            function dragstart(event) {

                this.classList.add(dragClass);

                dragIndex = $scope.$index;

            }

            function ondrag(event) {
            }

            function dragover(event) {

                event.dataTransfer.dropEffect = 'move';
            }

            function dragenter(event) {

                this.classList.add(dragClass);

                var to = $scope.$index;
                var from = dragIndex;

                /* Remove the item from its current index in the collection and store it. */
                var move = $scope.collection.splice(from, 1).pop();

                /* Insert the moved item into the new location in the collection. */
                $scope.collection.splice(to, 0, move);

                dragIndex = to;

                $scope.$apply();
            }

            function dragleave() {

                this.classList.remove(dragClass);
            }

            function dragend() {
                this.classList.remove(dragClass);
            }

        }

        return directive;
    }
);


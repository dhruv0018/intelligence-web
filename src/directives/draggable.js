var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var IntelligenceWebClient = require('../app');

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

            var expression = attributes.ngRepeat;

            /* Find the collection in the expression. */
            var collection = expression.match(/in\s+([\s\S]+?)?$/)[1];

            $scope.$watch(collection, function(collection) {

                $scope.collection = collection;
            });

            dragImage = document.createElement('img');
            dragImage.src = 'assets/move.png';

            element.attr('draggable', true);

            element.bind('dragstart', dragstart);
            element.bind('dragover', dragover);
            element.bind('dragenter', dragenter);
            element.bind('dragleave', dragleave);
            element.bind('dragend', dragend);
        }

        function dragstart(event) {

            this.classList.add(dragClass);

            var element = angular.element(event.target);

            var $scope = element.scope();

            dragIndex = $scope.$index;

            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(dragImage, dragImage.width/2, dragImage.height/2);
        }

        function dragover(event) {

            event.dataTransfer.dropEffect = 'move';
        }

        function dragenter(event) {

            this.classList.add(dragClass);

            var element = angular.element(event.srcElement);

            var $scope = element.scope();

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

        return directive;
    }
);


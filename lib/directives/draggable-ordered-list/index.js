let TO = '';
const ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * DraggableOrderedList
 * @module DraggableOrderedList
 */
const DraggableOrderedList = angular.module('DraggableOrderedList', []);

/**
 * DraggableOrderedList directive.
 * @module DraggableOrderedList
 * @name DraggableOrderedList
 * @type {Directive}
 * Rearranges a list, used in an ngRepeat (where each item is draggable)
 */
DraggableOrderedList.directive('draggableOrderedList',
    function() {

        let dragIndex;
        const dragstartClass = 'moving';

        const directive = {
            restrict: TO += ATTRIBUTES,
            compile: draggableOrderedListCompile,
            priority: 100
        };

        function draggableOrderedListCompile($scope, $attributes) {

            if (!$attributes.ngRepeat) {

                throw Error('draggableOrderedList Directive requires ngRepeat');
            }

            let expression = $attributes.ngRepeat;
            let match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            if (!match) {

                throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',
                    expression);
            }

            let rhs = match[2];


            return function draggableOrderedListLink($scope, $element, $attributes) {

                let collection;

                $scope.$watch(rhs, function ngRepeatAction(newCollection) {

                    collection = newCollection;
                });

                $attributes.$observe('draggableOrderedList', function draggableOrderedListObserve(value) {

                    if (!value) {

                        $element.removeClass('active');
                        $element.attr('draggable', false);

                    } else {

                        $element.addClass('active');
                        $element.attr('draggable', true);
                    }
                });

                function dragstart(event) {

                    $element.addClass(dragstartClass);
                    dragIndex = $scope.$index;
                }

                function dragover(event) {

                    if (event.preventDefault) {

                        event.preventDefault(); // Necessary. Allows us to drop.
                    }

                    event.dataTransfer.dropEffect = 'move';
                }

                // handles the re-ordering of items
                function dragenter(event) {

                    let to = $scope.$index;
                    let from = dragIndex;

                    $scope.$apply(function reorder() {

                        /* Remove the item from its current index in the collection and store it. */
                        let move = collection.splice(from, 1).pop();

                        /* Insert the moved item into the new location in the sortOrder. */
                        collection.splice(to, 0, move);

                        dragIndex = to;
                    });
                }

                function dragend(event) {

                    this.classList.remove(dragstartClass);
                }

                $element.bind('dragstart', dragstart);
                $element.bind('dragover', dragover);
                $element.bind('dragenter', dragenter);
                $element.bind('dragend', dragend);
            };
        }

        return directive;
    }
);

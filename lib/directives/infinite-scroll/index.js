/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add InfiniteScroll
 * @module Add InfiniteScroll
 */
var infiniteScroll = angular.module('InfiniteScroll', []);

/**
 * infiniteScroll directive.
 * @module infiniteScroll
 * @name infiniteScroll
 * @type {Directive}
 */
infiniteScroll.directive('infiniteScroll', [
    function directive() {
        var infiniteScroll = {
            link: function(scope, elm, attr) {
                var raw = elm[0];
                elm.bind('scroll', function() {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attr.infiniteScroll);
                    }
                });
            }
        };

        return infiniteScroll;
    }
]);

export default infiniteScroll;

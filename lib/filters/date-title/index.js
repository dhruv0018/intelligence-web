var angular = window.angular;

var DateTitle = angular.module('DateTitle.Filter', []);

DateTitle.filter('dateTitle', [
    '$filter',
    function(
        $filter
    ) {

        return function(dateStr) {

            if (angular.isDefined(dateStr)) {

                return $filter('date')(dateStr, 'MMM d, yyyy');
            } else {

                throw new Error('Attempted to utilize Date.Filter without an expression');
            }
        };
    }
]);

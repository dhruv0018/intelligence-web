const angular = window.angular;

import template from './template.html';
import controller from './controller';
let GoToAs = angular.module('GoToAs', []);

function goToAs () {

    return {

        restrict: 'E',
        scope: {
            user: '='
        },
        controller,
        template
    };
}

GoToAs.directive('goToAs', goToAs);

export default GoToAs;

const angular = window.angular;

import controller from './controller';

import TelestrationClearAllButton from './telestration-clear-all-button';
import TelestrationDeleteButton from './telestration-delete-button';
import TelestrationEnableButton from './telestration-enable-button';
import TelestrationToolbar from './telestration-toolbar';

const TelestrationControls = angular.module('TelestrationControls', [
    'TelestrationClearAllButton',
    'TelestrationDeleteButton',
    'TelestrationEnableButton',
    'TelestrationToolbar'
]);

// Directives
TelestrationControls.directive('telestrationControls', [
    function() {
        return {
            restrict: 'E',
            require: 'telestrations',
            scope: true,
            templateUrl: 'lib/directives/telestrations/telestration-controls/template.html',
            controller,
            controllerAs: 'controls'
        };
    }
]);

export default TelestrationControls;

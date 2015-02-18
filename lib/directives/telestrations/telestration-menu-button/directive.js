module.exports = [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-menu-template.html',
            transclude: true,
            controller: require('./controller')
        };
    }
];

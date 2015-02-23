module.exports = [
    '$timeout', 'VG_STATES', 'VG_EVENTS',
    function($timeout, VG_STATES, VG_EVENTS) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-controls-template.html',
            transclude: true,
            controller: require('./controller'),
            require: '^telestrations'
        };
    }
];

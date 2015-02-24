module.exports = [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-controls-template.html',
            transclude: true,
            controller: require('./controller'),
            require: '^telestrations'
        };
    }
];

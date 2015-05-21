/* Fetch angular from the browser scope */
const angular = window.angular;

/* Take a moment */
const moment = require('moment');

controller.$inject = [
    '$scope',
    'config'
];

function controller (
    $scope,
    config
) {

    $scope.lastUpdated = moment(config.termsDate).format('MMMM Do, YYYY');
}

export default controller;

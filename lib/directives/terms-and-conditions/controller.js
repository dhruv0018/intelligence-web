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

    let termsDate = moment(config.termsDate);

    $scope.lastUpdated = {

        full: termsDate.format('MMMM Do, YYYY'),
        year: termsDate.format('YYYY')
    };
}

export default controller;

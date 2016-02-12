GoToAsController.$inject = [
    'AccountService',
    '$scope'
];

function GoToAsController (
    account,
    $scope
) {
    $scope.account = account;
}

export default GoToAsController;

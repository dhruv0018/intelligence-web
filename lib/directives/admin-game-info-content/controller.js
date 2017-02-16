AdminGameInfoContentController.$inject = [
    '$scope'
];

function AdminGameInfoContentController (
    $scope
) {
    $scope.gameInfoTabs = {
        scores: {
            active: true,
            disabled: false
        },
        enableAll: function() {
            var self = this;
            var keys = Object.keys(self);
            angular.forEach(keys, function(key) {
                self[key].disabled = false;
            });
        },
        deactivateAll: function() {
            var self = this;
            var keys = Object.keys(self);
            angular.forEach(keys, function(key) {
                self[key].active = false;
            });
        }
    };
}

export default AdminGameInfoContentController;

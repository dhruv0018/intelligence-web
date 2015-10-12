EventAdjusterController.$inject = [
    '$scope'
];

function EventAdjusterController(
    $scope
) {
    console.log('working');
    $scope.event = {
        time: '20',
        get displayTime() {
            return '00:20';
        }
    };
}

export default EventAdjusterController;

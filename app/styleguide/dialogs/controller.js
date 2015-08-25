/* Fetch angular from the browser scope */
const angular = window.angular;

StyleguideDialogsController.$inject = [
    'PlaysFactory',
    'ArenaDialog.Service',
    'MobileAppDialog.Service',
    'TermsDialog.Service',
    'BreakdownDialog.Service',
    '$state',
    '$scope'
];

function StyleguideDialogsController (
    playsFactory,
    ArenaDialog,
    MobileAppDialog,
    TermsDialog,
    BreakdownDialog,
    $state,
    $scope
) {

    const dialogs = [
        {
            name: 'Arena Field Dialog (Not Ready, requires dependencies)',
            controller: ArenaDialog,
            args: []
        },
        {
            name: 'Mobile App Dialog',
            controller: MobileAppDialog,
            args: []
        },
        {
            name: 'Terms Dialog',
            controller: TermsDialog,
            args: []
        },
        {
            name: 'Breakdown Dialog (Not Ready, requires loaded or mock Data)',
            controller: BreakdownDialog,
            args: []
        }
    ];

    $scope.dialogs = dialogs;

    $scope.showDialog = ($event, index) => {

        let dialog = dialogs[index];
        let args = dialog.args;

        dialog.controller.show($event, ...args);
    };
}

export default StyleguideDialogsController;

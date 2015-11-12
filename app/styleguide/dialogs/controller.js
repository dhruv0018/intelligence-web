/* Fetch angular from the browser scope */
const angular = window.angular;

StyleguideDialogsController.$inject = [
    'PlaysFactory',
    'AddProfileTeam.Modal',
    'AddReel.Modal',
    'AdminManagement.Modal',
    'ChangePassword.Modal',
    'DeleteGame.Modal',
    'ExcelUpload.Modal',
    'AssistantInfo.Modal',
    'AthleteInfo.Modal',
    'kvsUploaderInterface.Modal',
    'ManageProfileReels.Modal',
    'ProfileOnboarding.Modal',
    'RawFilm.Modal',
    'SelectIndexer.Modal',
    'ArenaDialog.Service',
    'MobileAppDialog.Service',
    'TermsDialog.Service',
    'BreakdownDialog.Service',
    '$state',
    '$scope'
];

function StyleguideDialogsController (
    playsFactory,
    AddProfileTeamModal,
    AddReelModal,
    AdminManagementModal,
    ChangePasswordModal,
    DeleteGameModal,
    ExcelUploadModal,
    AssistantInfoModal,
    AthleteInfoModal,
    kvsUploaderInterfaceModal,
    ManageProfileReelsModal,
    ProfileOnboardingModal,
    RawFilmModal,
    SelectIndexerModal,
    ArenaDialog,
    MobileAppDialog,
    TermsDialog,
    BreakdownDialog,
    $state,
    $scope
) {

    const dialogs = [
        {
            name: 'Arena Field',
            controller: ArenaDialog,
            enabled: false,
            type: 'Material Dialog',
            args: []
        },
        {
            name: 'Add Profile Team',
            controller: AddProfileTeamModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'Add Reel',
            controller: AddReelModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'Admin Management',
            controller: AdminManagementModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'Change password',
            controller: ChangePasswordModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: []
        },
        {
            name: 'Delete Game',
            controller: DeleteGameModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: []
        },
        {
            name: 'Excel Upload',
            controller: ExcelUploadModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: []
        },
        {
            name: 'Assistant Info',
            controller: AssistantInfoModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'Athlete Info',
            controller: AthleteInfoModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'KVS Uploader Interface',
            controller: kvsUploaderInterfaceModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: []
        },
        {
            name: 'Manage Profile Reels ',
            controller: ManageProfileReelsModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: []
        },
        {
            name: 'Profile Onboarding',
            controller: ProfileOnboardingModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: []
        },
        {
            name: 'Select Indexer',
            controller: SelectIndexerModal,
            type: 'UI-Bootstrap modal',
            enabled: true,
            args: [null, false]
        },
        {
            name: 'Raw Film',
            controller: RawFilmModal,
            type: 'UI-Bootstrap modal',
            enabled: false,
            args: [null]
        },
        {
            name: 'Mobile App',
            controller: MobileAppDialog,
            type: 'Material Dialog',
            enabled: true,
            args: []
        },
        {
            name: 'Terms',
            controller: TermsDialog,
            type: 'Material Dialog',
            enabled: true,
            args: []
        },
        {
            name: 'Breakdown',
            controller: BreakdownDialog,
            type: 'Material Dialog',
            enabled: false,
            args: []
        }
    ];

    $scope.dialogs = dialogs;

    $scope.show = ($event, dialog) => {

        let args = dialog.args;

        if (dialog.type === 'Material Dialog') dialog.controller.show($event, ...args);
        else if (dialog.type === 'UI-Bootstrap modal') dialog.controller.open(...args);
    };
}

export default StyleguideDialogsController;

const angular = window.angular;

FilmHomeReelsController.$inject = [
    '$scope',
    'UsersFactory',
    'ReelsFactory',
    'SessionService',
    'FilmHomeReels.Data',
    'ShareFilm.Modal'
];

/**
 * Film Home Reels page controller
 */
function FilmHomeReelsController(
    $scope,
    users,
    reels,
    session,
    data,
    shareFilmModal
) {
    let currentUser = session.getCurrentUser();
    //getByRelatedRole try to filter from the memory variable, which does not exclude the reels just got deleted
    $scope.reels = reels.getByRelatedRole().filter(reel=>{
        return !reel.isDeleted;
    });
    $scope.NoData = ($scope.reels.length === 0)? true: false;
    let reelsCopy = reels.getByRelatedRole().filter(reel=>{
        return !reel.isDeleted;
    });

    $scope.getUploaderName = function(reel) {
        if (reel.uploaderUserId === currentUser.id) {
            return 'Created by you';
        } else {
            let uploaderUser;
            if (reel.isSharedWithUser(currentUser)) {
                uploaderUser = users.get(reel.getShareByUser(currentUser).userId);
                return 'Shared by ' + uploaderUser.firstName + ' ' + uploaderUser.lastName;
            } else if (reel.isSharedWithTeamId(currentUser.currentRole.teamId)) {
                uploaderUser = users.get(reel.getShareByTeamId(currentUser.currentRole.teamId).userId);
                return 'Shared by ' + uploaderUser.firstName + ' ' + uploaderUser.lastName;
            } else {
                uploaderUser = users.get(reel.uploaderUserId);
                return 'Created by ' + uploaderUser.firstName + ' ' + uploaderUser.lastName;
            }

        }
    };

    $scope.hideShareButton = function(reel) {
        return (reel.uploaderUserId !== currentUser.id)
            && (reel.isSharedWithUser(currentUser) || reel.isSharedWithTeamId(currentUser.currentRole.teamId));
    };

    $scope.openShareModal = function($event, game) {
        $event.preventDefault();
        $event.stopPropagation();
        shareFilmModal.open(game);
    };

    $scope.search = function(){
        $scope.reels = reelsCopy.filter(reel =>{
            let name = $scope.filters.name.toLowerCase();
            return reel.name.toLowerCase().indexOf(name) > -1;
        });
    };
}

export default FilmHomeReelsController;

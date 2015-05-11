/**
* SelectMediaSrc.Controller dependencies
*/
SelectMediaSrcController.$inject = [
    '$scope',
    'TRANSCODE_PROFILES_IDS',
    'TRANSCODE_PROFILES'
];

/**
 * SelectMediaSrc.Controller
 * @module SelectMediaSrc
 * @name SelectMediaSrc.Controller
 * @type {Controller}
 */
function SelectMediaSrcController (
    $scope,
    TRANSCODE_PROFILES_IDS,
    TRANSCODE_PROFILES
) {

    $scope.TRANSCODE_PROFILES_IDS = TRANSCODE_PROFILES_IDS;
    $scope.TRANSCODE_PROFILES = TRANSCODE_PROFILES;
    $scope.onVideoQualitySelect = onVideoQualitySelect;
    $scope.sortDescendingByBitrate = sortDescendingByBitrate;

    function onVideoQualitySelect(transcodeProfileId) {

        $scope.videoPlayer.sources.forEach(source => {

            if (source.transcodeProfileId === parseInt(transcodeProfileId, 10)) {

                $scope.vgSource.videos = [source];
            }
        });
    }

    function sortDescendingByBitrate(sources) {

        return sources.sort((a, b) => {

            return b.transcodeProfileId > a.transcodeProfileId;
        });
    }
}

export default SelectMediaSrcController;

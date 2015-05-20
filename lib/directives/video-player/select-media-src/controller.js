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
    let videoPlayer = $scope.videoPlayer;
    let sortedTranscodeProfiles = sortDescendingByBitrate(videoPlayer.sources);

    $scope.TRANSCODE_PROFILES_IDS = TRANSCODE_PROFILES_IDS;
    $scope.TRANSCODE_PROFILES = TRANSCODE_PROFILES;
    $scope.onVideoQualitySelect = onVideoQualitySelect;
    $scope.highestTranscodeProfile = sortedTranscodeProfiles[0].transcodeProfileId;

    function onVideoQualitySelect(transcodeProfileId) {

        videoPlayer.sources.forEach(source => {

            if (source.transcodeProfileId === parseInt(transcodeProfileId, 10)) {

                $scope.vgSource.videos = [source];
            }
        });
    }

    function sortDescendingByBitrate(sources) {

        return sources.sort((a, b) => b.transcodeProfileId - a.transcodeProfileId);
    }
}

export default SelectMediaSrcController;

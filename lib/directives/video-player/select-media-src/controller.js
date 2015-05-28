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
    let video = $scope.videoPlayer.video;
    let transcodeProfiles = video.transcodeProfiles;
    let sortedTranscodeProfiles = sortDescendingByBitrate(transcodeProfiles);

    $scope.TRANSCODE_PROFILES_IDS = TRANSCODE_PROFILES_IDS;
    $scope.TRANSCODE_PROFILES = TRANSCODE_PROFILES;
    $scope.onVideoQualitySelect = onVideoQualitySelect;
    $scope.highestTranscodeProfileId = sortedTranscodeProfiles[0].id;

    function onVideoQualitySelect(selectedTranscodeProfileId) {

        transcodeProfiles.forEach(transcodeProfile => {

            if (transcodeProfile.id === parseInt(selectedTranscodeProfileId, 10)) {

                let index = transcodeProfiles.indexOf(transcodeProfile);
                $scope.vgSource.videos = [video.resourceUrls[index]];
            }
        });
    }

    function sortDescendingByBitrate(transcodeProfiles) {

        return transcodeProfiles.sort((a, b) => b.targetBirate - a.targetBirate);
    }
}

export default SelectMediaSrcController;

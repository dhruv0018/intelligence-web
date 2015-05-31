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

    $scope.TRANSCODE_PROFILES_IDS = TRANSCODE_PROFILES_IDS;
    $scope.TRANSCODE_PROFILES = TRANSCODE_PROFILES;
    $scope.onVideoQualitySelect = onVideoQualitySelect;

    function onVideoQualitySelect(selectedTranscodeProfileId) {

        transcodeProfiles.forEach(transcodeProfile => {

            if (transcodeProfile.id === parseInt(selectedTranscodeProfileId, 10)) {

                let index = transcodeProfiles.indexOf(transcodeProfile);
                $scope.vgSource.videos = [video.resourceUrls[index]];
            }
        });
    }
}

export default SelectMediaSrcController;

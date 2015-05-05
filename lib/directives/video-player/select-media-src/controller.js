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

    function onVideoQualitySelect(transcodeProfile) {

        $scope.videoPlayer.sources.forEach(source => {

            if (source.transcodeProfile === parseInt(transcodeProfile, 10)) {

                $scope.vgSource.videos = [source];
            }
        });
    }
}

export default SelectMediaSrcController;

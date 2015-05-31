/**
* SelectMediaSrc.Controller dependencies
*/
SelectMediaSrcController.$inject = [
    '$scope'
];

/**
 * SelectMediaSrc.Controller
 * @module SelectMediaSrc
 * @name SelectMediaSrc.Controller
 * @type {Controller}
 */
function SelectMediaSrcController (
    $scope
) {
    let video = $scope.videoPlayer.video;
    let transcodeProfiles = video.transcodeProfiles;

    $scope.transcodeProfiles = transcodeProfiles;
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

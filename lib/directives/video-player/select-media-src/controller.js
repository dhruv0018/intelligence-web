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
    $scope.selectedTranscodeProfile = video.transcodeProfiles[0];

    $scope.onVideoQualitySelect = (selectedTranscodeProfile) => {

        video = $scope.videoPlayer.video;
        let selectedTranscodeProfileId = selectedTranscodeProfile.id;
        let transcodeProfiles = video.transcodeProfiles;

        transcodeProfiles.forEach(transcodeProfile => {

            if (transcodeProfile.id === selectedTranscodeProfileId) {

                let index = transcodeProfiles.indexOf(transcodeProfile);
                $scope.videoPlayer.config.sources = [video.resourceUrls[index]];
            }
        });
    };
}

export default SelectMediaSrcController;

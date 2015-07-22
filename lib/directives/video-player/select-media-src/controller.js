/**
* SelectMediaSrc.Controller dependencies
*/
SelectMediaSrcController.$inject = [
    'VideoPlayer',
    '$scope',
    '$timeout'
];

/**
 * SelectMediaSrc.Controller
 * @module SelectMediaSrc
 * @name SelectMediaSrc.Controller
 * @type {Controller}
 */
function SelectMediaSrcController (
    videoPlayer,
    $scope,
    $timeout
) {

    let video = $scope.videoPlayer.video;
    let selectedBitrate;

    videoPlayer.selectedMediaSrc = {};

    $scope.currentTranscodeProfile = video.transcodeProfiles[0];

    $scope.onVideoQualitySelect = (currentTranscodeProfile) => {

        selectedBitrate = currentTranscodeProfile.targetBitrate;

        video = $scope.videoPlayer.video;
        let currentTranscodeProfileId = currentTranscodeProfile.id;
        let transcodeProfiles = video.transcodeProfiles;

        transcodeProfiles.forEach(transcodeProfile => {

            if (transcodeProfile.id === currentTranscodeProfileId) {

                let index = transcodeProfiles.indexOf(transcodeProfile);
                $scope.videoPlayer.sources = [video.resourceUrls[index]];
                $timeout($scope.API.play.bind($scope.API), 100);
            }
        });
    };

    videoPlayer.selectedMediaSrc.getSelectedOrBestSource = (video) => {

        if (!video) return null;

        if (!selectedBitrate) {

            $scope.currentTranscodeProfile = video.transcodeProfiles[0];
            return video.resourceUrls[0];
        }

        let determinedSource;

        video.transcodeProfiles.forEach((transcodeProfile, index) => {

            let targetBitrate = transcodeProfile.targetBitrate;

            // If selected bitrate is found, set determined source
            if (selectedBitrate === targetBitrate) {

                $scope.currentTranscodeProfile = transcodeProfile;
                determinedSource = video.resourceUrls[index];
            }
        });

        if (!determinedSource) {

            // If source is not yet determined, return first resource url
            $scope.currentTranscodeProfile = video.transcodeProfiles[0];
            return video.resourceUrls[0];

        } else {

            return determinedSource;
        }
    };
}

export default SelectMediaSrcController;

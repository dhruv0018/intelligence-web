export default `

<select
    class="select-media-src"
    ng-model="currentTranscodeProfile"
    ng-change="onVideoQualitySelect(currentTranscodeProfile)"
    ng-options="transcodeProfile.title for transcodeProfile in videoPlayer.video.transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
>
</select>

`;

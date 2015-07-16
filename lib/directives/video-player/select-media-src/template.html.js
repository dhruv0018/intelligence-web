export default `

<select
    class="select-media-src"
    ng-model="selectedTranscodeProfile"
    ng-change="onVideoQualitySelect(selectedTranscodeProfile)"
    ng-options="transcodeProfile.title for transcodeProfile in videoPlayer.video.transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
>
</select>

`;

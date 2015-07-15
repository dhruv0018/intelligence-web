export default `

<select
    class="icon select-media-src"
    ng-model="currentTranscodeProfile"
    ng-change="onVideoQualitySelect(currentTranscodeProfile)"
    ng-options="transcodeProfile.title for transcodeProfile in videoPlayer.video.transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
    tooltip="Film quality"
>
</select>

`;

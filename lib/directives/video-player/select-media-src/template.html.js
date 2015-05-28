export default `

<select
    class="select-media-src"
    ng-init="transcodeProfileId = highestTranscodeProfileId"
    ng-model="transcodeProfileId"
    ng-change="onVideoQualitySelect(transcodeProfileId)"
>
    <!-- FIXME: orderBy source.targetBitrate instead of ID -->
    <option
        ng-repeat="transcodeProfile in videoPlayer.video.transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
        value="{{transcodeProfile.id}}"
    >
        {{transcodeProfile.title}}
    </option>
</select>

`;

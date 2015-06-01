export default `

<select
    class="select-media-src"
    ng-init="transcodeProfileId = highestTranscodeProfile"
    ng-model="transcodeProfileId"
    ng-change="onVideoQualitySelect(transcodeProfileId)"
>
    <!-- FIXME: orderBy source.targetBitrate instead of ID -->
    <option
        ng-repeat="source in videoPlayer.sources | orderBy: '-source.transcodeProfileId'"
        value="{{source.transcodeProfileId}}"
    >
        {{TRANSCODE_PROFILES[TRANSCODE_PROFILES_IDS[source.transcodeProfileId]].quality}}
    </option>
</select>

`;

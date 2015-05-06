export default `

<select
    class="select-media-src"
    ng-init="transcodeProfileId = videoPlayer.sources.length"
    ng-model="transcodeProfileId"
    ng-change="onVideoQualitySelect(transcodeProfileId)"
>
    <option
        ng-repeat="source in videoPlayer.sources | orderBy: '-source.transcodeProfileId'"
        value="{{source.transcodeProfileId}}"
    >
        {{TRANSCODE_PROFILES[TRANSCODE_PROFILES_IDS[source.transcodeProfileId]].quality}}
    </option>
</select>

`;

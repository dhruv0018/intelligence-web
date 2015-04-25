export default `

<select
    class="select-media-src"
    ng-init="transcodeProfile = videoPlayer.sources.length"
    ng-model="transcodeProfile"
    ng-change="onVideoQualitySelect(transcodeProfile)"
>
    <option
        ng-repeat="source in videoPlayer.sources | orderBy: '-source.transcodeProfile'"
        value="{{source.transcodeProfile}}"
    >
        {{TRANSCODE_PROFILES[TRANSCODE_PROFILES_IDS[source.transcodeProfile]].quality}}
    </option>
</select>

`;

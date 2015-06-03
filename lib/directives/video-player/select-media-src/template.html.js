export default `

<select
    class="select-media-src"
    ng-model="selectedTranscodeProfileId"
    ng-change="onVideoQualitySelect(selectedTranscodeProfileId)"
>
    <option
        ng-repeat="transcodeProfile in transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
        value="{{transcodeProfile.id}}"
    >
        {{transcodeProfile.title}}
    </option>
</select>

`;

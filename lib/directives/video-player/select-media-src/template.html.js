export default `

<select
    class="select-media-src"
    ng-init="transcodeProfileId = transcodeProfiles[0].id"
    ng-model="transcodeProfileId"
    ng-change="onVideoQualitySelect(transcodeProfileId)"
>
    <option
        ng-repeat="transcodeProfile in transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'"
        value="{{transcodeProfile.id}}"
    >
        {{transcodeProfile.title}}
    </option>
</select>

`;

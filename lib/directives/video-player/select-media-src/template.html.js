export default `
<div class="select-media-src dropup" dropdown is-open="status.isopen">

    <button type="button" class="btn btn-blank control-button" dropdown-toggle ng-disabled="disabled" title="Film quality">
        {{currentTranscodeProfile.title}}<icon class="icon icon-caret-down"></icon>
    </button>

    <ul class="dropdown-menu" role="menu" aria-labelledby="single-button">
        <li role="menuitem" ng-repeat="transcodeProfile in videoPlayer.video.transcodeProfiles | orderBy: '-transcodeProfile.targetBitrate'">
            <a href="#" ng-click="onVideoQualitySelect(transcodeProfile)">{{transcodeProfile.title}}</a>
        </li>
    </ul>
</div>
`;

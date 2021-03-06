export default `
<div>

    <hr>

    <div
        ng-hide="editFlag"
        class="playFooter">

        <button
            class="btn-delete-play"
            ng-if="isIndexer"
            ng-disabled="play.isSaving"
            ng-click="deletePlay()"
            >
            Delete Play
        </button>

        <div class="save-indicator" ng-if="isIndexer">
            <i
                class="icon icon-refresh active"
                ng-show="play.isSaving"
                ></i>
            <i
                class="icon icon-ok success"
                ng-show="play.id"
                ng-hide="!play.id || play.isSaving || play.error"
                ></i>
            <i
                class="icon icon-remove error"
                ng-show="play.error"
                ></i>
        </div>

        <div class="tags-container" ng-show="isTeamMember && !isReelsPlay" feature="SelectPlays">
            <span class="tags-label">Tags:</span>
            <custom-tag-pills ng-model="customTags" play="play"></custom-tag-pills>
        </div>
    </div>
</div>
`;

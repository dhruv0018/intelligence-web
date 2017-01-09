export default `

<div class="add-reels-dropdown dropdown" uib-dropdown is-open="dropdownStatus.isopen">
    <button
        class="btn btn-sm dropdown-toggle"
        ng-class="{'btn-default': !dropdownStatus.isopen, 'btn-primary': dropdownStatus.isopen}"
        uib-dropdown-toggle ng-disabled="disabled">
            Add to Reel
        </button>
    <div class="reels-dropdown-menu dropdown-menu" ng-click="$event.stopPropagation()" ng-class="{'reels-are-selected': selectedReels.length}">
        <div class="selected-reels" ng-if="selectedReels.length">
            <reel-pills ng-model="selectedReels"></reel-pills>
        </div>
        <div class="reels-selector" ng-if="!isCreatingNewReel && !addSuccess">
            <div class="search-reels">
                <i class="icon icon-search"></i>
                <input
                    id="reels-search-cta"
                    ng-model="searchFilters.name"
                    ng-change="updateAvailableReels()"
                    placeholder="Search Reels"
                    maxlength="50">
            </div>
            <div class="create-new-reel-button">
                <a href ng-click="startCreatingNewReel()">+ Create New Reel</a>
            </div>
            <div class="reels-list">
                <ul ng-show="filteredReels.length">
                    <li ng-repeat="reel in filteredReels" ng-click="selectReel(reel)">
                        <span class="reel-label">{{reel.name}}<span>
                    </li>
                </ul>
                <no-results ng-if="!filteredReels.length"></no-results>
            </div>
            <div class="reel-action-buttons">
                <a href ng-click="cancel()" ng-if="!isAddingToReel">Cancel</a>
                <a href class="pull-right" ng-if="selectedReels.length && !isAddingToReel" ng-click="addToReel()">Apply</a>
                <span class="empty-apply" ng-if="!selectedReels.length && !isAddingToReel">Apply</span>
                <span class="applying" ng-if="isAddingToReel">Applying... <krossover-spinner size="12px"></krossover-spinner></span>
            </div>
        </div>

        <div class="create-new-reel" ng-if="isCreatingNewReel && !addSuccess">
            <div class="reels-list force-scrollbar">
                <input type="text" name="newReelName" ng-model="newReelName" placeholder="Name for your reel" class="form-control" ng-disabled="isAddingToReel">
            </div>
            <div class="reel-action-buttons">
                <a href ng-click="cancelCreatingNewReel()" ng-if="!isAddingToReel">Cancel</a>
                <a href class="pull-right" ng-if="newReelName && !isAddingToReel" ng-click="createReel(newReelName)">
                    Create Reel + Add Clip<span ng-if="plays.length > 1">s</span>
                </a>
                <span class="empty-apply" ng-if="!newReelName && !isAddingToReel">Create Reel + Add Clip<span ng-if="plays.length > 1">s</span></span>
                <span class="applying" ng-if="isAddingToReel">Applying... <krossover-spinner size="12px"></krossover-spinner></span>
            </div>
        </div>

        <div class="successfully-added" ng-if="addSuccess">
            <div class="successfully-added-header"><i class="icon icon-ok"></i> <span>Added to Reel</span></div>
            <div class="successfully-added-body">
                <p>
                    We've added the selected clip<span ng-if="plays.length > 1">s</span> to the Reel
                </p>
                <p ng-if="forSelfEditor">
                    Please note that the clips from Film Editor are not yet available on mobile
                </p>
            </div>
            <div class="reel-action-buttons">
                <a href class="pull-right" ng-click="cancel()">Close</a>
            </div>
        </div>
    </div>
</div>
`;

export default `

<div class="self-editing-playlist">

    <div ng-if="playList.isEmpty()" class="playlist-empty-state">
        <div class="editor-empty-state" ng-show="currentSelfEditorState === EDITOR_STATE">
            <p>No Plays? Let's get started!</p>
            <p>5 Easy Steps to clip your film:</p>
            <ol>
                <li>Play video (use button or 'Spacebar')</li>
                <li>Set start time (use button or press 'Enter')</li>
                <li>Set end time (use button or press 'Enter')</li>
                <li>Add tags (optional)</li>
                <li>Repeat</li>
            </ol>
        </div>

        <div class="breakdown-empty-state" ng-show="currentSelfEditorState === BREAKDOWN_STATE">
            Try our Self-Editing tool and quickly create and tag plays for this film!
        </div>
    </div>

    <div ng-if="filteredPlayList.isEmpty() && !playList.isEmpty()" class="playlist-empty-state">
        <h3>No plays to show</h3>
        <p>Try a different way to filter plays by your tags</p>
    </div>

    <div ng-if="!filteredPlayList.isEmpty()">

        <div class="playlist-tagging-controls" ng-if="!hideEditingOptions">
            <div ng-show="tagsApplied" class="add-tag-success">
                <i class="icon icon-ok"></i>
                Tags Applied
            </div>
            <div ng-hide="tagsApplied" class="select-all">
                <check-box
                    ng-click="toggleSelectAllPlays()"
                    checked="selectedPlays.length === filteredPlayList.identity.length"
                    indeterminate="selectedPlays.length > 0 && selectedPlays.length < filteredPlayList.identity.length">
                </check-box>
                <span ng-show="!selectedPlays.length">Select All</span>
                <span ng-show="selectedPlays.length">{{selectedPlays.length}} Selected</span>
            </div>

            <custom-tags-dropdown ng-hide="tagsApplied" feature="CustomTags" plays="selectedPlays" for-self-editor="true" disabled="!selectedPlays.length"></custom-tags-dropdown>
        </div>
        <div class="playlist-item-list">
            <div
                ng-repeat="play in filteredPlayList.identity"
                class="playlist-item-container"
                ng-class="{
                    'play-selected-for-editing': isPlaySelectedForEditing(play),
                    'play-disabled': isPlayNotSelectedForEditing(play),
                    'play-is-newly-made' : isPlayNewlyMade(play),
                    'play-is-newly-made-finished' : isPlayNewlyMadeFinished(play)
                }"
            >
                <div class="playlist-item-content">

                    <span class="playlist-item-index">{{ filteredPlayList.identity.indexOf(play) + 1 }}.</span>

                    <check-box
                        ng-hide="play.newPlayInProgress"
                        feature="SelectPlays"
                        checked="isPlaySelected(play)"
                        ng-click="togglePlaySelection(play)"
                    ></check-box>

                    <div class="play-saved-tag" ng-if="play.newPlayFinished === true">
                        <i class="icon icon-check-circle"></i>
                        <p>saved</p>
                    </div>

                    <self-edited-play play="play" video="game.video" show-state-actions="currentSelfEditorState === EDITOR_STATE"></self-edited-play>

                </div>

                <self-edited-play-footer ng-show="play.customTagIds.length" play="play"></self-edited-play-footer>
            </div>
        </div>
    </div>

</div>
`;

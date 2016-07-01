export default `
<div class="self-editing-playlist">
    <div class="clips-header" ng-show="currentSelfEditorState === EDITOR_STATE && !playList.isEmpty()">
        <h3>Clips</h3>
        <i class="icon icon-question-circle question-button"
            data-tooltip-placement="bottom"
            data-tooltip-html-unsafe='
                <h3>How to Use Film Editor</h3>

                <table>
                    <tr>
                        <td>
                            <i class="icon icon-film-help-icon"></i>
                        </td>
                        <td>
                            <p><b>To create or end a clip:</b></p>
                            <p>Hit enter or click on "Create Clip" or "End Clip"</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="icon icon-play-help-icon"></i>
                        </td>
                        <td>
                            <p><b>To play or pause the video:</b></p>
                            <p>Hit the space bar or click on the video player</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="icon icon-tag-help-icon"></i>
                        </td>
                        <td>
                            <p><b>To add tags:</b></p>
                            <p>Click on the "Add Tag" button and type in the tag</p>
                        </td>
                    </tr>
                </table>
            '>

        </i>
    </div>
    <div ng-if="playList.isEmpty()" class="playlist-empty-state">
        <div class="editor-empty-state" ng-show="currentSelfEditorState === EDITOR_STATE">
            <h3>How to Use Film Editor</h3>
            <table>
                <tr>
                    <td>
                        <i class="icon icon-film-help-icon"></i>
                    </td>
                    <td>
                        <p><b>To create or end a clip:</b></p>
                        <p>Hit enter or click on "Create Clip" or "End Clip"</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <i class="icon icon-play-help-icon"></i>
                    </td>
                    <td>
                        <p><b>To play or pause the video:</b></p>
                        <p>Hit the space bar or click on the video player</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <i class="icon icon-tag-help-icon"></i>
                    </td>
                    <td>
                        <p><b>To add tags:</b></p>
                        <p>Click on the "Add Tag" button and type in the tag</p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="breakdown-empty-state" ng-show="currentSelfEditorState === BREAKDOWN_STATE">
            <h3>Try our Self-Editing tool and quickly create and tag plays for this film!</h3>
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
                Tag<span ng-show="multipleTagsApplied">s</span> Applied
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

            <button feature="SelfEditorReels" class="btn btn-sm btn-default" open-modal="AddReel.Modal" modal-options="addToReeOptions" ng-disabled="!selectedPlays.length">Add to Reel</button>
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

                    <span class="playlist-item-index">{{ play.playIndex || filteredPlayList.identity.indexOf(play) + 1 }}.</span>

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

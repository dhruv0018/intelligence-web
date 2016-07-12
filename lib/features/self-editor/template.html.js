export default `

    <div ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE" class="self-editing-header">
        <div class="team-name-header">
            <h6>{{ctrl.game.datePlayed|date:'dd-MM-yyyy'}}</h6>
            <h3>{{ctrl.team.name}} vs {{ctrl.opposingTeam.name}}</h3>
        </div>
        <button class="btn btn-rounded" ng-click="ctrl.toggleSelfEditorState()">
            <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE">Finish Editing</span>
        </button>
    </div>

    <div ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE" class="filter-container screen-lg-min">

        <self-edited-plays-filters
            plays="filteredPlayList"
            game="game"
        ></self-edited-plays-filters>

    </div>

    <div class="main-highlight" ng-class="{'editing-mode': ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE}">

        <krossover-sidebar>

            <self-editing-playlist
                game="ctrl.game"
                play-list="ctrl.playList"
                filtered-play-list="filteredPlayList"
                current-self-editor-state="ctrl.CURRENT_SELF_EDITOR_STATE"
                hide-editing-options="ctrl.hideEditingOptions">
            </self-editing-playlist>

            <div class="breakdown-sidebar-footer" ng-if="(ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE && !ctrl.hideEditingOptions)">
                <button class="btn btn-primary" ng-click="ctrl.toggleSelfEditorState()" ng-disabled="ctrl.isEditModeEnabled">
                    <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE && ctrl.playList.isEmpty()">Start Editing</span>
                    <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE && !ctrl.playList.isEmpty()">Continue Editing</span>
                </button>
            </div>
        </krossover-sidebar>

        <div class="self-editing-video-container">
            <video-player
                video="ctrl.video"
                cue-points="ctrl.cuePoints"
                poster-image="ctrl.posterImage"
                self-editing-mode="true"
                telestrations="telestrations"
                telestrations-permissions="telestrationsPermissions">
            </video-player>

            <self-editing-controls
                ng-if="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE"
                team="ctrl.team"
                game="ctrl.game">
            </self-editing-controls>
        </div>
    </div>

    <div class="request-breakdown" ng-if="(ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE && !ctrl.game.isDelivered() && !ctrl.game.isBeingBrokenDown() && ctrl.isBreakDownAvailable())">
                Want us to break down this game for you? <a ui-sref="Games.Info">Order a breakdown</a>
    </div>
`;

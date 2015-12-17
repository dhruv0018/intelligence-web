export default `

    <div ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE" class="self-editing-header">
        <div class="clips-header"><h3>Clips</h3></div>
        <div class="team-name-header"><h3>{{ctrl.team.name}} vs {{ctrl.opposingTeam.name}}</h3></div>
    </div>

    <div ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE" class="filter-container screen-lg-min">

        <custom-tags-filter
            plays="filteredPlayList"
            game="game"
        ></custom-tags-filter>

    </div>

    <div class="main-highlight" ng-class="{'editing-mode': ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE}">

        <krossover-sidebar>

            <self-editing-playlist
                game="ctrl.game"
                play-list="ctrl.playList"
                filtered-play-list="filteredPlayList"
                current-self-editor-state="ctrl.CURRENT_SELF_EDITOR_STATE">
            </self-editing-playlist>

            <div class="breakdown-sidebar-footer">
                <button class="btn btn-primary" ng-click="ctrl.toggleSelfEditorState()" ng-disabled="ctrl.isEditModeEnabled">
                    <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE && ctrl.playList.isEmpty()">Start Editing</span>
                    <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.BREAKDOWN_STATE && !ctrl.playList.isEmpty()">Continue Editing</span>
                    <span ng-show="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE">Finish Editing</span>
                </button>
            </div>
        </krossover-sidebar>

        <div class="self-editing-video-container">
            <video-player
                video="ctrl.video"
                cue-points="ctrl.cuePoints"
                poster-image="ctrl.posterImage"
                self-editing-mode="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE">
            </video-player>

            <self-editing-controls
                ng-if="ctrl.CURRENT_SELF_EDITOR_STATE === ctrl.EDITOR_STATE"
                team="ctrl.team"
                game="ctrl.game"
                cue-points="ctrl.cuePoints">
            </self-editing-controls>
        </div>
    </div>

`;

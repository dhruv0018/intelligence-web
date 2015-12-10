export default `

    <div ng-if="ctrl.indexingMode" class="self-editing-header">
        <div class="clips-header"><h3>Clips</h3></div>
        <div class="team-name-header"><h3>{{ctrl.team.name}} vs {{ctrl.opposingTeam.name}}</h3></div>
    </div>

    <div ng-if="!ctrl.indexingMode" class="filter-container screen-lg-min">

        <plays-filter></plays-filter>

    </div>

    <div class="main-highlight" ng-class="{'editing-mode': ctrl.indexingMode}">

        <krossover-sidebar>

            <div class="breakdown-sidebar-empty-state" ng-hide="ctrl.indexingMode">
                Try our Self-Editing tool and quickly create and tag plays for this film!
            </div>

            <self-editing-playlist ng-show="ctrl.indexingMode" indexing-mode="ctrl.indexingMode"></self-editing-playlist>

            <div class="breakdown-sidebar-footer">
                <button class="btn btn-primary" ng-click="ctrl.indexingMode = !ctrl.indexingMode">
                    <span ng-hide="ctrl.indexingMode">Start Editing</span>
                    <span ng-show="ctrl.indexingMode">Finish Editing</span>
                </button>
            </div>
        </krossover-sidebar>

        <video-player
            video="ctrl.video"
            poster-image="ctrl.posterImage"
            self-editing-mode="ctrl.indexingMode">
        </video-player>

    </div>

`;

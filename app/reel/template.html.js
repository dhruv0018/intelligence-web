export default `

    <section class="reels-player-area">

        <film-header film="reel" is-editable="canUserEdit" ng-show="$root.viewport.name === VIEWPORTS.DESKTOP.name"></film-header>

        <div class="reel-body">

            <div class="reel-edit-control-container" ng-if="canUserEdit && $root.viewport.name === VIEWPORTS.DESKTOP.name">

                <div class="reel-edit-controls">

                    <a id="reels-edit-clips-cta" href ng-hide="editFlag" ng-click="toggleEditMode()"><i class="icon icon-edit"></i> Edit Clips</a>
                    <a id="reels-edit-clips-save-cta" href ng-show="editFlag" ng-click="saveReels()" class="save-edit"><i class="icon icon-download"></i> Save Changes</a>
                    <a id="reels-edit-clips-cancel-cta" href ng-show="editFlag" ng-click="toggleEditMode()">Cancel</a>

                </div>

            </div>

            <div class="main-highlight ng-scope" ui-view="content" ng-class="{'not-editable': !canUserEdit}">

                <krossover-sidebar ng-if="$root.viewport.name === VIEWPORTS.DESKTOP.name">

                    <krossover-playlist></krossover-playlist>

                </krossover-sidebar>

                <video-player
                    class="reels-video-container"
                    poster-image="posterImage"
                    video="video"
                    cue-points="cuePoints"
                    telestrations="telestrationsEntity"
                    telestrations-permissions="telestrationsPermissions"
                    play-id="currentPlayId"
                >
                </video-player>

                <clips-navigation
                    ng-if="$root.viewport.name === VIEWPORTS.MOBILE.name"
                    video="video"
                    plays="plays"
                ></clips-navigation>

            </div>

        </div>

        <public-footer ng-hide="auth.isLoggedIn"></public-footer>

    </section>
`;

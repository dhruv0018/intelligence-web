export default `

    <section class="reels-player-area">

        <film-header data-film="reel" data-is-editable="canUserEdit"></film-header>

        <div class="reel-body">

            <div class="reel-edit-control-container" ng-if="canUserEdit && $root.viewport.name === VIEWPORTS.DESKTOP.name">

                <div class="reel-edit-controls">

                    <a href data-ng-hide="editFlag" data-ng-click="toggleEditMode()"><i class="icon icon-edit"></i> Edit Clips</a>
                    <a href data-ng-show="editFlag" data-ng-click="saveReels()" class="save-edit"><i class="icon icon-download"></i> Save Changes</a>
                    <a href data-ng-show="editFlag" data-ng-click="toggleEditMode()">Cancel</a>

                </div>

            </div>

            <div class="main-highlight ng-scope" data-ui-view="content" ng-class="{'not-editable': !canUserEdit}">

                <krossover-sidebar>

                    <krossover-playlist></krossover-playlist>

                </krossover-sidebar>

                <video-player
                data-ng-if="$root.viewport.name === VIEWPORTS.DESKTOP.name"
                class="reels-video-container"
                poster-image="posterImage"
                sources="sources"
                cue-points="cuePoints"
                telestrations="telestrationsEntity"
                telestrations-permissions="telestrationsPermissions"
                play-id="currentPlayId"
                >
                </video-player>

            </div>

        </div>

        <public-footer data-ng-hide="auth.isLoggedIn"></public-footer>

    </section>
`;

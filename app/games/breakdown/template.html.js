export default `

    <div class="games-breakdown">

        <div class="filter-container screen-lg-min">

            <plays-filter
                    data-game="game"
                    data-ng-model="filteredPlaysIds">
            </plays-filter>

        </div>

        <div class="main-highlight">

            <krossover-sidebar>

                <breakdown></breakdown>

            </krossover-sidebar>

            <video-player
                class="screen-lg-min"
                poster-image="posterImage"
                video="::currentVideo"
                cue-points="cuePoints"
                telestrations="telestrationsEntity"
                play-id="currentPlayId"
                telestrations-permissions="telestrationsPermissions"
                ng-show="$root.viewport.name === VIEWPORTS.DESKTOP.name">
            </video-player>

        </div>

    </div>

`;

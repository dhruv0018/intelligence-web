export default `

    <div class="games-self-editor">

        <div class="filter-container screen-lg-min">

            <plays-filter game="game" ng-model="filteredPlaysIds">
            </plays-filter>

        </div>

        <div class="main-highlight">

            <krossover-sidebar></krossover-sidebar>

            <video-player
                class="screen-lg-min"
                poster-image="posterImage"
            ></video-player>

        </div>

    </div>

`;

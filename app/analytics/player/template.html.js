export default `

    <section class="analytics">
        <div>
            <div class="analytics-options">

                <div class="analytics-option">
                    <span>Season:&nbsp;</span>
                    <select
                        id="analytics-season-cta"
                        ng-options="season.id as season | formattedSeasons for season in seasons"
                        ng-model="filterQuery.seasonId"
                        ng-change="generateStats()"
                    ></select>
                </div>

                <div class="analytics-option">
                    <span>Game Type:&nbsp;</span>
                    <select
                        id="analytics-gametype-cta"
                        ng-model="filterQuery.gameType"
                        ng-change="generateStats()"
                    >
                        <option value="">All Stats</option>
                        <option value="{{GAME_TYPES.CONFERENCE.id}}">Conference Stats</option>
                        <option value="{{GAME_TYPES.NON_CONFERENCE.id}}">Non-Conference Stats</option>
                        <option value="{{GAME_TYPES.PLAYOFF.id}}">Playoffs Stats</option>
                    </select>
                </div>

                <div class="analytics-option" ng-hide="currentUserIsAthlete">
                    <span>Player:&nbsp;</span>
                    <search-dropdown
                        options="players"
                        option-label="player"
                        filter-criteria="extendedName"
                        on-select="generateStats"
                        ng-model="player"
                    ></search-dropdown>
                </div>
                <div class="analytics-option" ng-if="currentUserIsAthlete && teams.length > 1">
                    <span>Team:&nbsp;</span>
                    <select
                        id="analytics-team-cta"
                        ng-options="teamOption as teamOption.name for teamOption in teams"
                        ng-model="team"
                        ng-change="changeTeam(team)"
                    ></select>
                </div>
            </div>

            <div
                class="all-center unselected-player"
                ng-show="loadingTables === undefined"
            >
                <i class="icon icon-bar-chart-o"></i>
                <h4>Please select a player to view analytics</h4>
            </div>

            <div
                class="all-center"
                ng-show="loadingTables"
            >
                <krossover-spinner size="'40px'"></krossover-spinner>
                <p>Loading Statistics...</p>
            </div>

            <div
                class="analytics-tables-container"
                ng-hide="loadingTables"
            >

                <div class="analytics-tables-container" ng-hide="loadingTables">
                    <dynamic-tables tables="stats" sport="sport"></dynamic-tables>
                </div>
            </div>

        </div>
    </section>

`;

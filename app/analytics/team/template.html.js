export default `

    <section class="analytics">

        <div>

            <div class="analytics-options">

                <div class="analytics-option">
                    <span>Season:&nbsp;</span>
                    <select id="analytics-season-cta"
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
                        <option value="">All Games</option>
                        <option value="{{GAME_TYPES.CONFERENCE.id}}">Conference</option>
                        <option value="{{GAME_TYPES.NON_CONFERENCE.id}}">Non-Conference</option>
                        <option value="{{GAME_TYPES.PLAYOFF.id}}">Playoffs</option>
                    </select>
                </div>
                <!--TODO: generate list of opponents
                <div class="analytics-option">
                    <span>Opponent</span>
                    <select>
                        <option>All</option>
                        <option>Other team</option>
                        <option>Another team</option>
                    </select>
                </div>-->
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
                <dynamic-tables tables="stats" sport="sport" width="90%"></dynamic-tables>
            </div>
        </div>
    </section>

`;

export default `

    <div class="game-area-formations">
        <div class="formations-teams-header">
            <div class="formation-option">
                <span class="option-label">Team on Offense</span>
                <select ng-model="myTeam">
                    <option value="true">{{teams[game.teamId].name}}</option>
                    <option value="false">{{teams[game.opposingTeamId].name}}</option>
                </select>
            </div>
            <div class="formation-option">
                <span class="option-label">Show formations from</span>
                <select ng-model="redzone">
                    <option value="false">Whole Field</option>
                    <option value="true">Red Zone</option>
                </select>
            </div>
            <div class="formation-option">
                <span class="option-label">Filter by tags</span>
                <custom-tags-multiselect ng-model="customTagIds" custom-tags="customtags"></custom-tags-multiselect>
            </div>
        </div>

        <accordion close-others="true">
            <formation-chart arena-type="arenaType" chart="chart" ng-repeat="chart in report[teamId]" redzone="isRedZone" plays="plays"></formation-chart>
            <no-results ng-hide="report[teamId].length"></no-results>
        </accordion>
    </div>

`;

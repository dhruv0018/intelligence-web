export default `

    <div
        class="wsc-link-container"
        ng-class="{'large-season-highlight': seasonId && isAthlete && teams.length > 1,
            'small-season-highlight': seasonId && (isCoach || isAthlete && teams.length === 1)}">
        <h3 class="wsc-highlight-title" ng-show="gameId || reelId">New Premium Highlights</h3>
        <h3 class="wsc-highlight-title" ng-show="seasonId">New Season Highlights</h3>
        <span class="wsc-highlight-info" ng-show="gameId">
            We customize your best clips from this game.
        </span>
        <span class="wsc-highlight-info" ng-show="reelId">
            We customize these clips into a premium highlight reel.
        </span>
        <span class="wsc-highlight-info" ng-show="seasonId && isCoach">
            We customize your best clips from this season.
        </span>
        <span class="wsc-highlight-info" ng-show="seasonId && isAthlete">
            We customize your best basketball clips from this season.
        </span>
        <select
            class="form-control"
            ng-show="isAthlete && seasonId && teams.length > 1"
            ng-options="team as team.name for team in teams"
            ng-model="selectedTeam"></select>
        <button
            id="wsc-highlight-cta"
            class="btn btn-sm"
            ng-class="{'btn-primary': reelId || gameId, 'btn-blue': seasonId}"
            ng-click="createWSCHighlight()">Order Now</button>
    </div>
`;

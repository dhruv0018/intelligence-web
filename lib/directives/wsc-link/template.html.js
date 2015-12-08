export default `

    <div class="wsc-link-container">
        <h3 class="wsc-highlight-title" ng-show="gameId || reelId || (seasonId && isCoach)">New Premium Highlights</h3>
        <span class="wsc-highlight-info" ng-show="gameId">
            We customize your best clips from this game.
        </span>
        <span class="wsc-highlight-info" ng-show="reelId">
            We customize these clips into a premium highlight reel.
        </span>
        <span class="wsc-highlight-info" ng-show="seasonId && isCoach">
            We customize your best clips from this season.
        </span>
        <button id="wsc-highlight-cta" class="btn btn-primary btn-sm" ng-click="createWSCHighlight()">Order Now</button>
    </div>
`;

export default `

    <div class="wsc-link-container">
        <span class="wsc-highlight-title" ng-show="gameId || (seasonId && isCoach)">Show me the highlights!</span>
        <span class="wsc-highlight-title" ng-show="reelId">Customize this reel!</span>
        <span class="wsc-highlight-info" ng-show="gameId">
            We'll automatically pick the best clips from this game,
            add an intro and music, and send you a slick custom highlight reel.
        </span>
        <span class="wsc-highlight-info" ng-show="reelId">
            We'll add transitions, an intro, and mix in your choice of music.
            Click to turn this playlist into a slick custom highlight reel.
        </span>
        <span class="wsc-highlight-info" ng-show="seasonId && isCoach">
            We'll automatically pick the best clips of the season,
            add transitions and music, and send you a slick custom highlight reel.
        </span>
        <button id="wsc-highlight-cta" class="btn-blue btn-sm" ng-click="createWSCHighlight()">Get Started</button>
    </div>
`;

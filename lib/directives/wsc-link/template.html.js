export default `
    <div class="wsc-link-container">
        <span class="wsc-highlight-title" ng-show="gameId || seasonId">Show me the highlights!</span>
        <span class="wsc-highlight-title" ng-show="reelId">Customize this reel!</span>
        <span class="wsc-highlight-info" ng-show="gameId">
            We’ll automatically pick the best clips from this game, add an
            intro, and mix in your choice of music. Click here to turn this
            game into a slick custom highlight reel.
        </span>
        <span class="wsc-highlight-info" ng-show="reelId">
            We’ll add transitions, an intro, and mix in your choice of
            music. Click here to turn this playlist into a slick custom
            highlight reel that you can share with anyone
        </span>
        <span class="wsc-highlight-info" ng-show="seasonId">
            We’ll automatically pick the best clips of the season, add
            transitions, and mix in your favorite music. Click here to get a
            slick custom highlight reel.
        </span>
        <a href="{{wscURL}}" target="_blank">
            <button id="wsc-highlight-cta" class="btn-blue btn-sm">Get Started</button>
        </a>
    </div>
`;

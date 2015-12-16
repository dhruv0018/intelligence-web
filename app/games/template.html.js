export default `

    <div class="games"
        ng-class="{'film-header-hidden': !game.video.isComplete()}">

        <film-header
            data-game-states="gameStates"
            data-film="game"
            data-ng-show="game.video.isComplete()">
        </film-header>

        <div class="games-content" data-ui-view="gameView"></div>

        <public-footer data-ng-hide="auth.isLoggedIn"></public-footer>

    </div>

`;
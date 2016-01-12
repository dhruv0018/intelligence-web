export default `

    <div class="games"
        ng-class="{'film-header-hidden': !game.video.isComplete()}">

        <film-header
            game-states="gameStates"
            film="game"
            ng-show="game.video.isComplete() && !hideHeader">
        </film-header>

        <div class="games-content" ui-view="gameView"></div>

        <public-footer ng-hide="auth.isLoggedIn"></public-footer>

    </div>

`;

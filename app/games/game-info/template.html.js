export default `

    <div class="games-game-info"
        ng-class="{'game-info-uploading-controls-displayed': game.video.isIncomplete()}">
        <div class="breakdown-status">
            <span class="broken-down" ng-if="game.isDelivered()">This game was broken down <span ng-if="returnedDate"> and returned on {{ returnedDate | date:'mediumDate' }}</span></span>
            <span class="breaking-down" ng-if="game.status > GAME_STATUSES['READY_FOR_INDEXING'].id && !game.isDelivered()">
                This game is currently being broken down.
            </span>
        </div>

        <div class="info-container">

            <uploading-controls
                class="game-info-uploading-controls animated"
                ng-show="game.video.isIncomplete()"
                game="game"
                redirect-state="add-film"
            ></uploading-controls>

            <upload-status game="game"></upload-status>

            <krossover-coach-game
                game="game"
                league="league"
                remaining-breakdowns="remainingBreakdowns">
            </krossover-coach-game>
        </div>
    </div>

`;

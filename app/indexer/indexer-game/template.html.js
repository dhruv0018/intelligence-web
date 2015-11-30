export default `

    <section class="indexer-games-game-info">

        <div class="content-wrapper">

            <header>

                <h2>Game Id <em>#{{ game.id }}</em></h2>
                <h1>{{ team.name }} vs {{ opposingTeam.name }}</h1>
                <h3>{{ school.name }} {{ sport.name }}, <a data-ui-sref="user-info({ id: headCoach.id })">Coach {{ headCoach.lastName }}</a></h3>
                <h3>Period is in: <span class="period">{{ league.periodLabel }}</span></h3>
            </header>

            <main class="content content-full-height">

                <table class="game-info table table-bordered">

                    <colgroup>
                        <col class="col-md-4">
                        <col class="col-md-2">
                        <col class="col-md-3">
                        <col class="col-md-3">
                    </colgroup>

                    <thead>

                        <tr>

                            <th>Teams</th>
                            <th>Colors</th>
                            <th>Reported Scores</th>
                            <th>Indexed Scores</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td class="name">

                                <h1>{{ team.name }}</h1>

                            </td>

                            <td class="colors">

                                <div class="row">

                                    <div class="col-xs-6">

                                        <h6>Primary</h6>
                                        <input class="form-control" name="yourprimarycolor" type="color" data-ng-model="game.primaryJerseyColor" disabled>

                                    </div>

                                    <div class="col-xs-6">

                                        <h6>Secondary</h6>
                                        <input class="form-control" name="yourprimarycolor" type="color" data-ng-model="game.secondaryJerseyColor" disabled>

                                    </div>

                                </div>

                            </td>

                            <td class="score">

                                <h2>{{ game.finalScore }}</h2>

                            </td>

                            <td class="score">

                                <h2 data-ng-class="{ correct: game.finalScore === game.indexedScore, incorrect: game.indexedScore && game.finalScore !== game.indexedScore }">{{ game.indexedScore || '--' }}<span data-ng-if="game.indexedScore"><i class="icon icon-ok" data-ng-show="game.finalScore === game.indexedScore"></i><i class="icon icon-remove" data-ng-hide="game.finalScore === game.indexedScore"></i></span></h2>

                            </td>

                        </tr>

                        <tr>

                            <td class="name">

                                <h1>{{ opposingTeam.name }}</h1>

                            </td>

                            <td class="colors">

                                <div class="row">

                                    <div class="col-xs-6">

                                        <h6>Primary</h6>
                                        <input class="form-control" name="theirprimarycolor" type="color" data-ng-model="game.opposingPrimaryJerseyColor" disabled>

                                    </div>

                                    <div class="col-xs-6">

                                        <h6>Secondary</h6>
                                        <input class="form-control" name="theirprimarycolor" type="color" data-ng-model="game.opposingSecondaryJerseyColor" disabled>

                                    </div>

                                </div>

                            </td>

                            <td class="score">

                                <h2>{{ game.opposingFinalScore }}</h2>

                            </td>

                            <td class="score">

                                <h2 data-ng-class="{ correct: game.opposingFinalScore === game.opposingIndexedScore, incorrect: game.opposingIndexedScore && game.opposingFinalScore !== game.opposingIndexedScore }">{{ game.opposingIndexedScore || '--' }}<span data-ng-if="game.opposingIndexedScore"><i class="icon icon-ok" data-ng-show="game.opposingFinalScore === game.opposingIndexedScore"></i><i class="icon icon-remove" data-ng-hide="game.opposingFinalScore === game.opposingIndexedScore"></i></span></h2>

                            </td>

                        </tr>

                        <tr>

                            <td colspan="4">
                                <h3><i class="icon icon-thumb-tack"></i> Coaches Notes:</h3>
                                <div>
                                    <ul>
                                        <li ng-repeat="note in game.notes[GAME_NOTE_TYPES.COACH_NOTE]">{{note.content}}</li>
                                    </ul>
                                </div>
                            </td>

                        </tr>

                    </tbody>

                </table>

            </main>

        </div>

        <aside class="sidebar sidebar-right">

            <button class="btn btn-start-indexing" data-ng-show="game.canBeIndexed()" data-ui-sref="indexing({ id: game.id })">
                <span data-ng-hide="game.isAssignmentStarted()">Start </span>
                <span data-ng-show="game.isAssignmentStarted()">Continue</span>
                <span data-ng-show="game.isAssignedToIndexer()">Indexing</span>
                <i class="icon icon-chevron-right pull-right"></i>
            </button>

            <button class="btn btn-start-indexing" data-ng-show="game.canBeQAed()" data-ui-sref="indexing({ id: game.id })">
                <span data-ng-hide="game.isAssignmentStarted()">Start </span>
                <span data-ng-show="game.isAssignmentStarted()">Continue </span>
                <span>QA</span>
                <i class="icon icon-chevron-right pull-right"></i>
            </button>


            <ul>

                <li
                    feature="IndexerFlags"
                    ng-if="isBasketballGame"
                >
                    <i class="icon icon-flag"></i>
                    <a
                        class="btn btn-link flags"
                        target="_blank"
                        ng-href="{{game.getFlagsUrl()}}"
                    >&nbsp;View Flags</a>
                </li>
                <li><button class="btn btn-link" data-ng-click="RawFilmModal.open(game)"><i class="icon icon-play-circle"></i> View raw film</button></li>
                <li><button class="btn btn-link" data-ui-sref="indexer-read-notes" disabled><i class="icon icon-save"></i> Read notes</button></li>
                <li><button class="btn btn-link" data-ng-click="setAside()">Set Aside</button></li>
                <li data-ng-if="currentAssignment.isQa" data-ng-click="revertAssignment()"><button class="btn btn-link">Revert to Indexer</button></li>

            </ul>

            <hr>

            <!-- TODO: Take a look at app/admin/queue/game.html which has the
                        code needed for this section -->
            <!--
                <h4>Time remaining to deliver</h4>
                <time>6h 15m</time>

                <h4>Game length</h4>
                <time>59m</time>

                <h4>Time to index:</h4>
                <time>1h 30m</time>

                <h4>Time to QA:</h4>
                <time>5m</time>

                <h4>Date uploaded</h4>
                <time>Jun 23, 1014</time>
            -->

        </aside>

    </section>

`;

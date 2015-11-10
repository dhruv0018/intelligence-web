export default `

<td>{{sports[leagues[teams[game.teamId].leagueId].sportId].name}}</td>

<td class="game-id">{{ game.id }}</td>

<td><a data-ui-sref="game({ id: game.id })">{{ teams[game.teamId].name }} vs {{ teams[game.opposingTeamId].name }}</a></td>

<td>
    <krossover-team-label-icon
        ng-if="teams[game.uploaderTeamId].label"
        label="LABELS[LABELS_IDS[teams[game.uploaderTeamId].label]]"
    ></krossover-team-label-icon>
</td>

<td>
    <span>
        {{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].firstName}} {{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].lastName}}
    </span>
</td>

<td>

    <span ng-if="game.getStatus().id != GAME_STATUSES.SET_ASIDE.id">{{ game.getStatus().name }}</span>

    <span ng-if="game.status === GAME_STATUSES.SET_ASIDE.id">
        <span ng-if="!game.canBeAssignedToQa() && !game.canBeAssignedToIndexer()">{{GAME_STATUSES.SET_ASIDE.name}}</span>
        <a ng-if="game.canBeAssignedToQa()" ng-click="SelectIndexerModal.open(game, true)">{{GAME_STATUSES.SET_ASIDE.name}} in QA</a>
        <a ng-if="game.canBeAssignedToIndexer()" ng-click="SelectIndexerModal.open(game, false)">{{GAME_STATUSES.SET_ASIDE.name}} in Indexing</a>
    </span>

    <span ng-if="!game.getStatus()">
        N/A
    </span>

</td>


<td>

    <button
        class="select-indexer"
        ng-if="!game.isAssignedToIndexer() && game.canBeAssignedToIndexer()"
        ng-click="SelectIndexerModal.open(game, false)"
    >Select Indexer</button>

    <ul
        ng-if="game.hasIndexerAssignment()"
        ng-repeat="assignment in game.indexerAssignments | filter:{ isQa: false } | limitTo:1"
    >

        <li>

            <button
                class="assignment"
                ng-disabled="game.status != GAME_STATUSES.SET_ASIDE.id"
                ng-click="SelectIndexerModal.open(game, false)"
            >{{ users[assignment.userId].firstName }} {{ users[assignment.userId].lastName }}</button>

        </li>

    </ul>

</td>

<td>

    <div ng-if="!game.hasQaAssignment() && !game.canBeAssignedToQa()">--</div>

    <button
        class="select-qa"
        ng-if="!game.isAssignedToQa() && game.canBeAssignedToQa()"
        ng-click="SelectIndexerModal.open(game, true)"
    >Select QA</button>

    <ul
        ng-if="game.hasQaAssignment()"
        ng-repeat="assignment in game.indexerAssignments | filter:{ isQa: true } | limitTo:1"
    >

        <li>

            <button
                class="assignment"
                ng-disabled="game.status != GAME_STATUSES.SET_ASIDE.id"
                ng-click="SelectIndexerModal.open(game, true)"
            >{{ users[assignment.userId].firstName }} {{ users[assignment.userId].lastName }}</button>

        </li>

    </ul>

</td>

<td class="game-duration">{{ game.video.duration | secondsAsHoursMinutesSeconds }}</td>

<td class="time-left">
    <span class="late" ng-if="game.remainingTime < 0">{{ game.remainingTime | millisecondsAsHours | hoursAsClock }}</span>
    <span ng-if="game.remainingTime === 0">None</span>
    <span ng-if="game.remainingTime > 0">{{ game.remainingTime | millisecondsAsHours | hoursAsClock }}</span>
</td>

<td>

    <button
        data-open-modal="AdminManagement.Modal"
        data-modal-options="game"
        class="manage-button"
    >

        <i class="icon icon-gear"></i>

    </button>

</td>
`;

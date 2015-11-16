export default `

<td>{{ sports[leagues[teams[game.teamId].leagueId].sportId].name | capitalizeFirstLetter }}</td>

<td class="game-id">{{ game.id }}</td>

<td><a data-ui-sref="game({ id: game.id })">{{ teams[game.teamId].name }} vs {{ teams[game.opposingTeamId].name }}</a></td>

<td>
    <krossover-team-label-icon
        ng-if="teams[game.uploaderTeamId].label"
        label="LABELS[LABELS_IDS[teams[game.uploaderTeamId].label]]"
    ></krossover-team-label-icon>
</td>

<td>
    <span ng-if="users[teams[game.uploaderTeamId].getHeadCoachRole().userId]">
        {{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].firstName}} {{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].lastName}}
    </span>
    <span ng-if="!users[teams[game.uploaderTeamId].getHeadCoachRole().userId]">
        No Active Head Coach
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
        No status
    </span>

</td>


<td>
    <span ng-if="game.getStatus()">
        <!-- Games that havent been submitted for a breakdown or are still in the workflow-->
        <span ng-if="game.indexerAssignments.length === 0 && (game.status === GAME_STATUSES.SUBMITTED_FOR_INDEXING.id || game.status === GAME_STATUSES.NOT_INDEXED.id)">
            Can't be assigned yet
        </span>
        <!-- Migrated games -->
        <span ng-if="game.indexerAssignments.length === 0 && (game.status === GAME_STATUSES.FINALIZED.id || game.status === GAME_STATUSES.INDEXED.id)">
            N/A
        </span>
    </span>

    <span ng-if="!game.getStatus()">
        <!-- Games without a status couldn't possibly have a indexer assignment because coach didnt make choice on uploader -->
        <span ng-if="game.indexerAssignments.length === 0">
            N/A
        </span>
    </span>

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
    <span ng-if="game.getStatus()">
        <!-- Migrated Games -->
        <span ng-if="game.indexerAssignments.length === 0 && (game.status === GAME_STATUSES.FINALIZED.id || game.status === GAME_STATUSES.INDEXED.id)">
            N/A
        </span>

        <!-- Games still in indexing -->
        <span ng-if="(game.indexerAssignments.length > 0 && !game.hasQaAssignment() && !game.canBeAssignedToQa())">
            Can't be assigned yet
        </span>

        <!-- New Games in the queue, or games that havent been submitted for a breakdown or still in the workflow -->
        <span ng-if="game.indexerAssignments.length === 0 && !(game.status === GAME_STATUSES.FINALIZED.id || game.status === GAME_STATUSES.INDEXED.id)">
            Can't be assigned yet
        </span>
    </span>

    <span ng-if="!game.getStatus()">
        <!-- Games without status display not available for assignments because they couldn't possibly have one with no status -->
        <span ng-if="game.indexerAssignments.length === 0">
            N/A
        </span>
    </span>

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
    <span class="late" ng-if="::game.timeRemaining() < 0">{{ ::game.timeRemaining() | millisecondsAsHours | hoursAsClock }}</span>
    <span ng-if="::game.timeRemaining() === 0">None</span>
    <span ng-if="::game.timeRemaining() > 0">{{ ::game.timeRemaining() | millisecondsAsHours | hoursAsClock }}</span>
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

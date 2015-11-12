export default `
<div class="revert-game-status">

    <header class="modal-header">

        <h3 class="modal-title">Revert Confirmation</h3>
        <i class="icon icon-remove" ng-click="$dismiss()"></i>

    </header>

    <div class="modal-body">
        <p class="warning">
            Are you sure you want to revert this game to {{GAME_STATUSES[GAME_STATUS_IDS[revertToStatus.id]].name}} ?
        </p>

        <button ng-click="revertGameStatus()" class="btn btn-danger">
            Yes, Continue
        </button>

        <button class="btn pull-right" ng-click="$close()">
            No, Cancel
        </a>
    </div>

</div>

`;

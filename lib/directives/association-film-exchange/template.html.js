export default `

    <div class="association-film-exchange">
        <div class="film-exchange-header">
            <h4 ng-hide="isEditingFilmExchange">{{filmExchange.name}}</h4>
            <i class="icon icon-pencil" ng-hide="isEditingFilmExchange" ng-click="onEditClick()"></i>
            <i class="icon icon-trash-o" ng-hide="isEditingFilmExchange" ng-click="onDeleteClick()"></i>

            <input class="form-control" ng-model="updatedFilmExchangeName" ng-show="isEditingFilmExchange">
            <button class="btn btn-xs btn-primary" ng-show="isEditingFilmExchange" ng-click="onSaveClick(updatedFilmExchangeName, updatedFilmExchangeIsActive)">Save</button>
            <button class="btn btn-xs btn-default" ng-show="isEditingFilmExchange" ng-click="onCancelClick()">Cancel</button>
        </div>
        <span class="film-exchange-conference-info">Conference: {{conference.name}} - {{filmExchange.gender | formattedConferenceGender}} {{sport.name}}</span>
        <span class="visible-to-teams" ng-show="filmExchange.isVisibleToTeams && !isEditingFilmExchange">Visible to teams</span>
        <span class="not-visible-to-teams" ng-show="!filmExchange.isVisibleToTeams && !isEditingFilmExchange">Not visible to teams</span>
        <span class="edit-visibility" ng-show="isEditingFilmExchange">
            Visible to teams
            <check-box
                checked="updatedFilmExchangeIsActive"
                ng-click="updatedFilmExchangeIsActive = !updatedFilmExchangeIsActive">
            </check-box>
        </span>
    </div>

`;

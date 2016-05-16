export default `

    <div class="association-film-exchange">
        <div class="film-exchange-header">
            <h4 ng-hide="isEditingFilmExchange">{{filmExchange.name}}</h4>
            <i class="icon icon-pencil" ng-hide="isEditingFilmExchange" ng-click="onEditClick()"></i>
            <i class="icon icon-trash-o" ng-hide="isEditingFilmExchange" ng-click="onDeleteClick()"></i>

            <div class="edit-input" ng-show="isEditingFilmExchange">
                <input class="form-control" ng-model="updatedFilmExchangeName">
            </div>

            <button class="btn btn-xs btn-primary" ng-show="isEditingFilmExchange" ng-disabled="!updatedFilmExchangeName.length" ng-click="onSaveClick(updatedFilmExchangeName, updatedFilmExchangeIsVisibleToTeams)">Save</button>
            <button class="btn btn-xs btn-default" ng-show="isEditingFilmExchange" ng-click="onCancelClick()">Cancel</button>
        </div>
        <span class="film-exchange-conference-info">Conference: {{conference.name}} - {{filmExchange.gender | formattedConferenceGender}} {{sport.name}}</span>
        <span class="visible-to-teams" ng-show="filmExchange.isVisibleToTeams && !isEditingFilmExchange">Visible to teams</span>
        <span class="not-visible-to-teams" ng-show="!filmExchange.isVisibleToTeams && !isEditingFilmExchange">Not visible to teams</span>
        <span class="edit-visibility" ng-show="isEditingFilmExchange">
            Visible to teams
            <check-box
                checked="updatedFilmExchangeIsVisibleToTeams"
                ng-click="updatedFilmExchangeIsVisibleToTeams = !updatedFilmExchangeIsVisibleToTeams">
            </check-box>
        </span>
    </div>

`;

export default `
<div class="admin-user-role">

    <role-icon user="user" role="role"></role-icon>

    <div class="sport"></div>

    <div class="role-description">
        <div class="role-info">
            <span class="first-name">{{user.firstName}}</span>
            <span class="last-name">{{user.lastName}}</span>
        </div>

        <div class="role-info">
            <span ng-if="user.id">{{role.type.name || 'Inactive'}}</span>
        </div>

        <div class="role-info" ng-if="team">
            <span>Team:</span>
            <span><a ui-sref="team-info({ id: team.id })">{{team.name}}</a></span>
        </div>

        <div class="role-info" ng-if="school">
            <span>School:</span>
            <span><a ui-sref="school-info({ id: school.id })">{{school.name}}</a></span>
        </div>

        <div class="role-info qa-status-toggle" ng-show="user.is(role, ROLES.INDEXER)">
            <span>QA Privileges: </span>

            <!-- TODO: Remove Angular Material -->
            <md-switch
                id="qa-privileges-on-off-cta"
                ng-model="role.indexerQuality"
                ng-true-value="1"
                ng-false-value="0"
                class="md-switch-green"
                ng-change="saveUser()"
            ></md-switch>
        </div>

        <div class="role-info" ng-show="user.is(role, ROLES.INDEXER) && role.indexerGroupId">
            <span>Marketplace:</span>
            <span>{{INDEXER_GROUPS_ID[role.indexerGroupId]}}</span>
        </div>

        <div class="role-info full top-margin" ng-show="user.is(role, ROLES.FILM_EXCHANGE_ADMIN) && newPrivilege">
            <span class="film-exchange-dropdown-container">
                <search-dropdown
                    options="filmExchanges"
                    option-label="film exchange"
                    filter-criteria="name"
                    on-select="onSelectFilmExchange"
                    ng-model="selectedExchange">
                </search-dropdown>
            </span>

            <span class="add-film-exchange-container">
                <button
                    class="btn btn-default left-margin"
                    ng-click="addNewFilmExchangePrivilege()"
                    ng-disabled="!newPrivilege.sportsAssociation">
                    Add Film Exchange
                </button>
            </span>

            <span class="film-exchange-button-container">
                <button
                    class="btn-link"
                    ng-click="cancelFilmExchangePrivilege()"
                >Cancel</button>
            </span>
        </div>

        <div class="role-info top-margin bottom-margin" ng-show="user.is(role, ROLES.FILM_EXCHANGE_ADMIN) && !newPrivilege">
            <button class="btn-link no-padding" ng-click="newFilmExchangePrivilege()"><i class="icon icon-plus"></i> Add Film Exchange</button>
        </div>

        <div class="role-info full-width" ng-repeat="privilege in privileges">
            <div class="film-exchange-name top-margin-small">{{privilege.filmExchangeName}}</div>
            <div class="film-exchange-button-container"><button class="btn-link" ng-click="deleteFilmExchangePrivilege(privilege)"><i class="icon icon-x"></i></button></div>
        </div>

        <div class="role-info" ng-if="!user.id">
            <span>New User</span>
        </div>
    </div>
</div>
`;

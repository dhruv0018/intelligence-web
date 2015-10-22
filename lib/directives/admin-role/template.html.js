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
            ></md-switch>
        </div>
        <div class="role-info" ng-show="user.is(role, ROLES.INDEXER) && role.indexerGroupId">
            <span>Marketplace:</span>
            <span>{{INDEXER_GROUPS_ID[role.indexerGroupId]}}</span>
        </div>

        <div class="role-info" ng-if="!user.id">
            <span>New User</span>
        </div>
    </div>
</div>
`;

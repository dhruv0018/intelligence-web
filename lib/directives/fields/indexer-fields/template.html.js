export default `

<div class="indexer-fields">

    <span ng-repeat="field in event.indexerFields" ng-switch on="field.type">

        <static-field field="field" ng-switch-when="STATIC"></static-field>

        <team-player-dropdown-field
            ng-switch-when="PLAYER_TEAM_DROPDOWN"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></team-player-dropdown-field>

        <player-dropdown-field
            ng-switch-when="PLAYER_DROPDOWN"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></player-dropdown-field>

        <team-dropdown-field
            ng-switch-when="TEAM_DROPDOWN"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></team-dropdown-field>

        <gap-dropdown-field
            ng-switch-when="GAP"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></gap-dropdown-field>

        <formation-dropdown-field
            ng-switch-when="FORMATION"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></formation-dropdown-field>

        <passing-zone-dropdown-field
            ng-switch-when="PASSING_ZONE"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></passing-zone-dropdown-field>

        <yard-dropdown-field
            ng-switch-when="YARD"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></yard-dropdown-field>

        <!-- TODO: tech debt incurred - subbing out the only text field for a yard field because it IS a yard field -->
        <yard-dropdown-field
            ng-switch-when="TEXT"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></yard-dropdown-field>

        <arena-dropdown-field
            ng-switch-when="ARENA"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></arena-dropdown-field>

        <dropdown-field
            ng-switch-when="DROPDOWN"
            event="event"
            field="field"
            ng-click="onFieldClick(field)"
        ></dropdown-field>
    </span>
</div>

`;

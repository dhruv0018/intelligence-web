export default `

<div class="indexer-script">

    <span ng-repeat="field in event.indexerFields">

        <span
            ng-if="field.type === 'STATIC'"
        >
            {{field.value}}
        </span>

        <team-player-dropdown-field
            ng-if="field.type === 'PLAYER_TEAM_DROPDOWN'"
            event="event"
            field="field"
        ></team-player-dropdown-field>

        <player-dropdown-field
            ng-if="field.type === 'PLAYER_DROPDOWN'"
            event="event"
            field="field"
        ></player-dropdown-field>

        <team-dropdown-field
            ng-if="field.type === 'TEAM_DROPDOWN'"
            event="event"
            field="field"
        ></team-dropdown-field>

        <gap-dropdown-field
            ng-if="field.type === 'GAP'"
            event="event"
            field="field"
        ></gap-dropdown-field>

        <formation-dropdown-field
            ng-if="field.type === 'FORMATION'"
            event="event"
            field="field"
        ></formation-dropdown-field>

        <passing-zone-dropdown-field
            ng-if="field.type === 'PASSING_ZONE'"
            event="event"
            field="field"
        ></passing-zone-dropdown-field>

        <!-- TODO: tech debt incurred - subbing out the only text field for a yard field because it IS a yard field -->
        <yard-dropdown-field
            ng-if="
                field.type === 'YARD' ||
                field.type === 'TEXT'
            "
            event="event"
            field="field"
        ></yard-dropdown-field>

        <arena-dropdown-field
            ng-if="field.type === 'ARENA'"
            event="event"
            field="field"
        ></arena-dropdown-field>

        <dropdown-field
            ng-if="field.type === 'DROPDOWN'"
            event="event"
            field="field"
        ></dropdown-field>
    </span>
</div>

`;

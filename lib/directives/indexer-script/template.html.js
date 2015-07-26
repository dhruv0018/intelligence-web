export default `

<div class="indexer-script">

    <span ng-repeat="field in event.indexerScript">

        <span ng-if="isString(field)">{{field}}</span>

        <team-player-dropdown-field
            ng-if="field.type === 'PLAYER_TEAM_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
        ></team-player-dropdown-field>

        <player-dropdown-field
            ng-if="field.type === 'PLAYER_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
        ></player-dropdown-field>

        <team-dropdown-field
            ng-if="field.type === 'TEAM_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
        ></team-dropdown-field>

        <gap-dropdown-field
            ng-if="field.type === 'GAP'"
            event="event"
            field="event.fields[field.index]"
        ></gap-dropdown-field>

        <formation-dropdown-field
            ng-if="field.type === 'FORMATION'"
            event="event"
            field="event.fields[field.index]"
        ></formation-dropdown-field>

        <passing-zone-dropdown-field
            ng-if="field.type === 'PASSING_ZONE'"
            event="event"
            field="event.fields[field.index]"
        ></passing-zone-dropdown-field>

        <!-- TODO: tech debt incurred - subbing out the only text field for a yard field because it IS a yard field -->
        <yard-dropdown-field
            ng-if="
                field.type === 'YARD' ||
                field.type === 'TEXT'
            "
            event="event"
            field="event.fields[field.index]"
        ></yard-dropdown-field>

        <arena-dropdown-field
            ng-if="field.type === 'ARENA'"
            event="event"
            field="event.fields[field.index]"
        ></arena-dropdown-field>

        <dropdown-field
            ng-if="field.type === 'DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
        ></dropdown-field>
    </span>
</div>

`;

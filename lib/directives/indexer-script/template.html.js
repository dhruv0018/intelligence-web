export default `

<div class="indexer-script" ng-mouseover="test">

    <span ng-repeat="field in event.indexerScript">

        <span ng-if="isString(field)">{{field}}</span>

        <team-player-dropdown-field
            ng-if="field.type === 'PLAYER_TEAM_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></team-player-dropdown-field>

        <player-dropdown-field
            ng-if="field.type === 'PLAYER_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></player-dropdown-field>

        <team-dropdown-field
            ng-if="field.type === 'TEAM_DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></team-dropdown-field>

        <gap-dropdown-field
            ng-if="field.type === 'GAP'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></gap-dropdown-field>

        <formation-dropdown-field
            ng-if="field.type === 'FORMATION'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></formation-dropdown-field>

        <passing-zone-dropdown-field
            ng-if="field.type === 'PASSING_ZONE'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></passing-zone-dropdown-field>

        <text-dropdown-field
            ng-if="field.type === 'TEXT'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></text-dropdown-field>

        <yard-dropdown-field
            ng-if="field.type === 'YARD'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></yard-dropdown-field>

        <arena-dropdown-field
            ng-if="field.type === 'ARENA'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></arena-dropdown-field>

        <dropdown-field
            ng-if="field.type === 'DROPDOWN'"
            event="event"
            field="event.fields[field.index]"
            id="field-{{field.index}}"
        ></dropdown-field>
    </span>
</div>

`;

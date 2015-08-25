export default `

<div class="indexer-script">

    <span
        ng-repeat="field in event.indexerFields"
        ng-switch on="field.type"
    >

        <static-field
            ng-switch-when="STATIC"
            field="field"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></static-field>

        <team-player-dropdown-field
            ng-switch-when="PLAYER_TEAM_DROPDOWN"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></team-player-dropdown-field>

        <player-dropdown-field
            ng-switch-when="PLAYER_DROPDOWN"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></player-dropdown-field>

        <team-dropdown-field
            ng-switch-when="TEAM_DROPDOWN"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></team-dropdown-field>

        <gap-dropdown-field
            ng-switch-when="GAP"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></gap-dropdown-field>

        <formation-dropdown-field
            ng-switch-when="FORMATION"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></formation-dropdown-field>

        <passing-zone-dropdown-field
            ng-switch-when="PASSING_ZONE"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></passing-zone-dropdown-field>

        <yard-dropdown-field
            ng-switch-when="YARD"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></yard-dropdown-field>

        <!-- TODO: tech debt incurred - subbing out the only text field for a yard field because it IS a yard field -->
        <yard-dropdown-field
            ng-switch-when="TEXT"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></yard-dropdown-field>

        <arena-dropdown-field
            ng-switch-when="ARENA"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></arena-dropdown-field>

        <dropdown-field
            ng-switch-when="DROPDOWN"
            event="event"
            field="field"
            ng-click="elementsManager.currentFieldIndex = field.index"
            autofocus="elementsManager.fieldShouldFocus(field.index, event.isValid)"
        ></dropdown-field>
    </span>
</div>

`;

class FieldsTemplate {

    constructor (className, fields) {

        this.className = className;
        this.fields = fields;
    }

    get template () {

        return `

        <div
            class="${this.className}"
            krossover-event-highlighting
            ng-click="selectEvent();"
        >

            <span
                ng-repeat="field in ${this.fields}"
                ng-switch on="field.type"
            >

                <static-field
                    field="field"
                    ng-switch-when="STATIC"
                ></static-field>

                <team-player-field
                    ng-switch-when="PLAYER_TEAM_DROPDOWN"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></team-player-field>

                <player-field
                    ng-switch-when="PLAYER_DROPDOWN"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></player-field>

                <team-field
                    ng-switch-when="TEAM_DROPDOWN"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></team-field>

                <gap-field
                    ng-switch-when="GAP"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></gap-field>

                <formation-field
                    ng-switch-when="FORMATION"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></formation-field>

                <passing-zone-field
                    ng-switch-when="PASSING_ZONE"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></passing-zone-field>

                <yard-field
                    ng-switch-when="YARD"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></yard-field>

                <!-- TODO: tech debt incurred - subbing out the only text field for a yard field because it IS a yard field -->
                <yard-field
                    ng-switch-when="TEXT"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></yard-field>

                <arena-field
                    ng-switch-when="ARENA"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></arena-field>

                <dropdown-field
                    ng-switch-when="DROPDOWN"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></dropdown-field>

                <period-field
                    ng-switch-when="PERIOD"
                    field="field"
                    ng-click="onFieldClick(field)"
                ></period-field>
            </span>
        </div>

        `;
    }
}

export default FieldsTemplate;

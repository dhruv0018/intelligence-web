import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        this.teams = injector.get('TeamsFactory');

        //initialization
        let teamOption = {
            name: !field.isRequired ? 'Optional' : undefined,
            teamId: (!field.isRequired && field.type === 'Team') ? null : undefined
        };

        if (field.value) {
            let team = this.teams.get(field.value);
            teamOption.name = team.name;
            teamOption.teamId = team.id;
        }

        this.currentValue = teamOption;
        this.availableOptions = []; //todo blocker
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(teamOption) {
        let value = {};
        if (!teamOption.id) {
            value = teamOption;
            this.value = value;
            return;
        }
        let team = this.teams.get(teamOption.id);
        teamOption.name = team.name;
        teamOption.teamId = team.id;
        this.value = value;
    }

    toJSON() {
        let variableValue = {};
        //todo make a constant for type
        variableValue = {
            type: 'Team',
            value: this.value.teamId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default TeamField;

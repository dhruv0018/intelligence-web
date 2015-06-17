import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        //initialization
        let value = {
            name: !field.isRequired ? 'Optional' : undefined,
            teamId: (!field.isRequired && field.type === 'Team') ? null : undefined
        };

        if (field.value) {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(field.value);
            value.name = team.name;
            value.teamId = team.id;
        }

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

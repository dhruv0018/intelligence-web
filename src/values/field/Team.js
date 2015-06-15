import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        if (field.value) {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(field.value);
            value.name = team.name;
            value.teamId = team.id;
        }

        this.value = value;

    }
}

export default TeamField;

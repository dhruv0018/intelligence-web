import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let teamPlayerOption = {
            teamId: (!field.isRequired && field.type === 'Team') ? null : undefined,
            playerId: (!field.isRequired && field.type === 'Player') ? null : undefined
        };

        if (field.value) {
            switch(field.type) {
                case 'Player':
                    let playerId = Number(field.value) ? Number(field.value) : null;
                    teamPlayerOption.playerId = playerId;
                    teamPlayerOption.teamId = undefined;
                    break;
                case 'Team':
                    let teamId = Number(field.value) ? Number(field.value) : null;
                    teamPlayerOption.teamId = teamId;
                    teamPlayerOption.playerId = undefined;
                    break;
            }
        }

        this.currentValue = teamPlayerOption;

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                let value = this.currentValue;
                let playerId = value.playerId;
                let teamId = value.teamId;
                let injector = angular.element(document).injector();

                if (playerId) {
                    let players = injector.get('PlayersFactory');
                    let player = players.get(playerId);
                    calculatedName = player.firstName + ' ' + player.lastName;
                }

                if (teamId) {
                    let teams = injector.get('TeamsFactory');
                    let team = teams.get(teamId);
                    calculatedName = angular.copy(team.name);
                }
                return calculatedName;
            }
        });

        this.availableValues = []; //todo blocker
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(teamPlayerOption) {
        let value = {
            playerId: teamPlayerOption.playerId,
            teamId: teamPlayerOption.teamId
        };
        this.type = (typeof value.playerId !== 'undefined') ? 'Player' : 'Team';
        this.value = value;
    }

    toJSON() {
        let variableValue = {
            type: this.type
        };

        switch(variableValue.type) {
            case 'Player':
                variableValue.value = (!this.isRequired && this.value.playerId === null) ? null : String(this.value.playerId);
                break;
            case 'Team':
                variableValue.value = (!this.isRequired && this.value.teamId === null) ? null : String(this.value.teamId);
                break;
        }

        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default TeamPlayerField;

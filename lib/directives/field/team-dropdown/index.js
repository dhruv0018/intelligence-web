import FieldDefinition from '../definition';
import FieldController from '../controller';

const TeamDropdown = angular.module('Field.TeamDropdown', []);

class TeamFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
TeamFieldController.$inject = ['$scope'];

class TeamFieldDefinition extends FieldDefinition {
    constructor() {
        super();
        this.controller = TeamFieldController;
    }
}

let definition = new TeamFieldDefinition();

TeamDropdown.directive('teamDropdownField', () => definition);

export default TeamDropdown;

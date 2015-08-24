import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from '../template.js';
import dropdownTemplate from './dropdown-input.html.js';

let dropdownTemplateUrl = 'field/team-player-dropdown-input.html';
let TeamPlayerDropdown = angular.module('Field.TeamPlayerDropdown', []);

class TeamPlayerFieldTemplate extends FieldTemplate {
    constructor(dropdownTemplateUrl, dropdownTemplate){
        super(dropdownTemplateUrl, dropdownTemplate);
    }
}

let fieldTemplate = new TeamPlayerFieldTemplate(dropdownTemplateUrl, dropdownTemplate);

class TeamPlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}
TeamPlayerFieldController.$inject = ['$scope'];

class TeamPlayerFieldDefinition extends FieldDefinition{

    constructor() {

        super();

        this.controller = TeamPlayerFieldController;
        this.template = fieldTemplate.template;
    }
}


TeamPlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);


let definition = new TeamPlayerFieldDefinition();

TeamPlayerDropdown.directive('teamPlayerDropdownField', () => definition);

export default TeamPlayerDropdown;

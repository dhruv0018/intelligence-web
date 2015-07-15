//jshint ignore: start
let dropdownTemplateUrl = 'field/team-player-dropdown-input.html';
let TeamPlayerDropdown = angular.module('Field.TeamPlayerDropdown', []);

import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';
import dropdownTemplate from './dropdown-input.html.js';

let template = FieldTemplate(dropdownTemplateUrl);

TeamPlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(dropdownTemplateUrl, dropdownTemplate);
    }
]);

class TeamPlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

class TeamPlayerFieldDefinition extends FieldDefinition{

    constructor() {

        super();

        this.controller = TeamPlayerFieldController;
        this.template = template;
    }
}

TeamPlayerFieldController.$inject = ['$scope'];


let definition = new TeamPlayerFieldDefinition();

TeamPlayerDropdown.directive('teamPlayerDropdownField', () => definition);

export default TeamPlayerDropdown;

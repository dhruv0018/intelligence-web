import FieldTemplate from '../template';

class TeamPlayerFieldTemplate extends FieldTemplate {

    constructor(dropdownTemplateUrl, dropdownTemplate){

        super(dropdownTemplateUrl, dropdownTemplate);
    }

    get template() {

        return `

        <color-shape ng-if="field.value.playerId" color="field.value.jerseyColor"></color-shape>
        ${super.template}

        `;
    }
}

export default TeamPlayerFieldTemplate;

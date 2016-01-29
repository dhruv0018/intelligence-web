import FieldTemplate from '../template';

class TeamFieldTemplate extends FieldTemplate {

    constructor(dropdownTemplateUrl, dropdownTemplate){

        super(dropdownTemplateUrl, dropdownTemplate);
    }

    get template() {

        return `

        <color-shape ng-if="field.value.id" color="field.value.color"></color-shape>
        ${super.template}

        `;
    }
}

export default TeamFieldTemplate;

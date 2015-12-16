import FieldTemplate from '../template';

class PlayerFieldTemplate extends FieldTemplate {

    constructor(dropdownTemplateUrl, dropdownTemplate){

        super(dropdownTemplateUrl, dropdownTemplate);
    }

    get template() {

        return `

        <color-shape ng-if="field.value.id" color="field.value.jerseyColor"></color-shape>
        ${super.template}

        `;
    }
}

export default PlayerFieldTemplate;

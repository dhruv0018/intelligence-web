/**
 * @param {}
 */
const KrossoverLabelSelectTemplate = () => `

    <md-select
        ng-model="label"
    >
        <md-option
            ng-value="labelOption.id"
            ng-repeat="labelOption in LABELS"
        >

            {{ labelOption.name }}
        </md-option>
    </md-select>

`;

export default KrossoverLabelSelectTemplate;

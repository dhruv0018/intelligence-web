/**
 * @param {}
 */
const KrossoverLabelSelectTemplate = () => `

    <md-select
        ng-model="label"
    >
        <md-option
            ng-value="null"
        >
            Select label
        </md-option>
        <md-option
            ng-value="labelOption.id"
            ng-repeat="labelOption in LABELS | orderObjectBy : 'index'"
        >
            <krossover-team-label-icon
                label="labelOption"
                tooltip="false"
            ></krossover-team-label-icon>
            {{ labelOption.name }}
        </md-option>
    </md-select>

`;

export default KrossoverLabelSelectTemplate;

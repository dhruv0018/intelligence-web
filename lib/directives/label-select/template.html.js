/**
 * @param {}
 */
const KrossoverLabelSelectTemplate = () => `

    <md-select
        ng-model="label"
        placeholder="Select label"
    >
        <md-option
            ng-value="labelOption.id"
            ng-repeat="labelOption in LABELS"
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

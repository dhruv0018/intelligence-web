/**
 * @param {}
 */
const KrossoverPrioritySelectTemplate = () => `

    <md-select
        ng-model="priority"
    >
        <md-option
            ng-value="priorityOption.value"
            ng-repeat="priorityOption in PRIORITIES"
        >

            <color-shape
                color="priorityOption.color"
            ></color-shape>
            {{ priorityOption.name }}
        </md-option>
    </md-select>
`;

export default KrossoverPrioritySelectTemplate;

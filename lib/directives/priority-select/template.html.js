/**
 * @param {}
 */
const KrossoverPrioritySelectTemplate = () => `

    <md-select
        class="priority-select"
        ng-model="priority"
    >
        <md-option
            ng-value="priorityOption.id"
            ng-repeat="priorityOption in PRIORITIES"
        >
            {{ priorityOption.name }}
        </md-option>
    </md-select>
`;

export default KrossoverPrioritySelectTemplate;

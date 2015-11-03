/**
 * @param {}
 */
const KrossoverPrioritySelectTemplate = () => `

    <md-select
        class="priority-select"
        ng-model="priority"
    >
        <md-option
            ng-class="{
                'highest-priority': priorityOption.id === PRIORITIES.HIGHEST.id,
                'high-priority': priorityOption.id === PRIORITIES.HIGH.id,
                'normal-priority': priorityOption.id === PRIORITIES.NORMAL.id
            }"
            ng-value="priorityOption.id"
            ng-repeat="priorityOption in PRIORITIES | orderBy: '-value'"
        >
            {{ priorityOption.name }}
        </md-option>
    </md-select>
`;

export default KrossoverPrioritySelectTemplate;

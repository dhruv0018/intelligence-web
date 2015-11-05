/**
 * @param {}
 */
const PriorityLabelLegendTemplate = () => `

    <h4>Legend</h4>
    <div
        ng-class="{
            'highest-priority': priority.id === PRIORITIES.HIGHEST.id,
            'high-priority': priority.id === PRIORITIES.HIGH.id,
            'normal-priority': priority.id === PRIORITIES.NORMAL.id
        }"
        ng-value="priority.id"
        ng-repeat="priority in PRIORITIES | orderBy: '-value'"
    >
        {{ priority.name }}
    </div>
    <div ng-repeat="label in LABELS">
        <krossover-team-label-icon
            label="label"
            tooltip="false"
        ></krossover-team-label-icon>
        {{ label.name }}
    </div>
`;

export default PriorityLabelLegendTemplate;

/**
 * @param {}
 */
const KrossoverPriorityLabelIconTemplate = () => `

    <span
        ng-class="{
            'highest-priority-label-icon': priority.id === PRIORITIES.HIGHEST.id,
            'high-priority-label-icon': priority.id === PRIORITIES.HIGH.id,
            'normal-priority-label-icon': priority.id === PRIORITIES.NORMAL.id
        }"
    >{{ priority.name }}</span>

`;

export default KrossoverPriorityLabelIconTemplate;

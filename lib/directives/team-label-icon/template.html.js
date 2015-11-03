/**
 * @param {}
 */
const KrossoverTeamLabelIconTemplate = () => `

    <md-tooltip
        ng-if="tooltip"
    >{{ label.name }}</md-tooltip>
    {{ label.abbreviation }}
`;

export default KrossoverTeamLabelIconTemplate;

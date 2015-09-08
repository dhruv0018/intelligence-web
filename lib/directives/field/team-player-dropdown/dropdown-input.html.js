//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <svg
        ng-if="match.model.playerId"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewbox="0 0 16 16"
    >

        <rect data-ng-attr-fill="{{ match.model.jerseyColor }}" x="0" y="0" width="16px" height="16px" />

    </svg>

    <span
        ng-if="match.model.playerId"
        bind-html-unsafe="match.model.name | typeaheadHighlight:query"
    ></span>
    <span
        ng-if="match.model.teamId"
        bind-html-unsafe="match.model.name | typeaheadHighlight:query"
    ></span>
</a>

`;

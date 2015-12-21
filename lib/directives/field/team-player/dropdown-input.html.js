//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <color-shape ng-if="match.model.playerId" color="match.model.jerseyColor"></color-shape>
    <color-shape ng-if="match.model.color" color="match.model.color"></color-shape>
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

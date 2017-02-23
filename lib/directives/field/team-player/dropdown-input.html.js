//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <color-shape ng-if="match.model.playerId" color="match.model.jerseyColor"></color-shape>
    <color-shape ng-if="match.model.color" color="match.model.color"></color-shape>
    <span
        ng-if="match.model.playerId"
        ng-bind-html="match.model.name | uibTypeaheadHighlight:query"
    ></span>
    <span
        ng-if="match.model.teamId"
        ng-bind-html="match.model.name | uibTypeaheadHighlight:query"
    ></span>
</a>

`;

//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <color-shape color="match.model.jerseyColor"></color-shape>
    <span ng-bind-html="match.model.name | uibTypeaheadHighlight:query"></span>
</a>

`;

//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <color-shape color="match.model.jerseyColor"></color-shape>
    <span data-bind-html-unsafe="match.model.name | typeaheadHighlight:query"></span>
</a>

`;

//TODO: use color-shape directive
export default `

<a ng-click="selectValue(match.model)">
    <color-shape color="match.model.color"></color-shape>
    <span bind-html-unsafe="match.model.name | typeaheadHighlight:query"></span>
</a>

`;

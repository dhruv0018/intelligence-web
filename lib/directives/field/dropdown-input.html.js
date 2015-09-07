export default `

<a ng-click="selectValue(match.model)">
    <span bind-html-unsafe="match.model.name | typeaheadHighlight:query"></span>
</a>

`;

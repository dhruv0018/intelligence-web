//jshint ignore: start
export default
`
<a ng-click="selectValue(match.model)">
    <span data-bind-html-unsafe="match.model.name | typeaheadHighlight:query"></span>
</a>

`;

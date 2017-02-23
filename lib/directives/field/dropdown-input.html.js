export default `

<a ng-click="selectValue(match.model)">
    <span ng-bind-html="match.model.name | uibTypeaheadHighlight:query"></span>
</a>

`;

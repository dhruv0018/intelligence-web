export default `

<div class="dynamic-tables">

    <div class="stats-btn-group">

        <button
            ng-repeat="table in tables"
            ng-class="{'active-stats-btn': (selectedTable === $index)}"
            class="stats-btn"
            ng-click="onTableSelect($index)"
        >{{table.meta.tableName || 'Table Name'}}</button>
    </div>

    <dynamic-table
        ng-repeat="table in tables"
        ng-show="$index === selectedTable"
        source="table"
        is-basketball="isBasketball"
    >
    </dynamic-table>
</div>

`;

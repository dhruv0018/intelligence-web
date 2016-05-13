export default `

<div class="dynamic-tables">

    <div class="stats-select-container" ng-style="{'width': width}" ng-show="tables && tables.length>0">
        <div class="stats-select">
            <div class="stats-select-header">Stat Type:</div>
            <select class="form-control" ng-init="selectedTableObject = tables[0]" ng-model="selectedTableObject" ng-change="onTableSelect()" ng-options="table.meta.tableName for table in tables">
            </select>
        </div>
    </div>

    <dynamic-table
        ng-repeat="table in tables"
        ng-show="$index === selectedTable"
        source="table"
        is-basketball-or-lax="isBasketballOrLax"
    >
    </dynamic-table>
</div>

`;

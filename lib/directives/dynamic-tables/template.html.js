export default `

<div class="dynamic-tables">

    <div class="table-options-container">
        <div class="stats-select-container" ng-show="tables && tables.length>0">
            <div class="stats-select">
                <div class="stats-select-header">Stat Type:</div>
                <select class="form-control" ng-init="selectedTableObject = tables[0]" ng-model="selectedTableObject" ng-change="onTableSelect()" ng-options="table.meta.tableName for table in tables">
                </select>
            </div>
        </div>
        <div class="stats-print-export-options">
            <stats-export teams="teams" game="game"></stats-export>
            <stats-print></stats-print>
        </div>
    </div>

    <dynamic-table
        class="dynamic-table"
        ng-repeat="table in tables"
        ng-show="$index === selectedTable"
        source="table"
        is-football="isFootball"
        glossary="glossary"
    >
    </dynamic-table>
</div>

`;

export default `
<div class="run-distribution-modal">

    <header class="modal-header">

        <h3 class="modal-title">Run Distribution</h3>
        <button class="btn btn-default">Reserve Games</button>
        <i class="icon icon-remove" ng-click="$dismiss()"></i>

    </header>

    <div class="modal-body">
        <h3 class="summary-report-title">Summary Report</h3>
        <div class="summary-report-container">
            <div class="summary-report-table">
                <h4>Basketball</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="name-col">Name</th>
                            <th>Current</th>
                            <th>New</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="indexerGroup in indexerGroups">
                            <td class="name-col">{{indexerGroup.attributes.name}}</td>
                            <td>10</td>
                            <td>20</td>
                            <td>23</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th class="name-col">Total</th>
                            <th>100</th>
                            <th>100</th>
                            <th>100</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>

</div>

`;

export default `
<div class="run-distribution-modal">

    <header class="modal-header">

        <h3 class="modal-title">Run Distribution</h3>
        <button class="btn btn-default" ng-disabled="loadingDistributionSummary || noGamesToDistribute" ng-click="reserveGames()">
            <span ng-hide="reservingGames">Reserve Games</span>
            <krossover-spinner size="'18px'" ng-show="reservingGames"></krossover-spinner>
        </button>
        <i class="icon icon-remove" ng-click="$dismiss()"></i>

    </header>

    <div class="modal-body" ng-class="{'loading-summary': loadingDistributionSummary}">
        <div class="loading-display" ng-if="loadingDistributionSummary && !noGamesToDistribute">
            <krossover-spinner size="40px"></krossover-spinner>
            <p>Generating distribution summary, please wait...</p>
        </div>

        <div class="no-games-to-distribute" ng-if="noGamesToDistribute">
            <h3>There are currently no games to distribute</h3>
        </div>

        <h3 class="summary-report-title" ng-if="!loadingDistributionSummary && !noGamesToDistribute">Summary Report</h3>
        <div class="summary-report-container" ng-if="!loadingDistributionSummary && !noGamesToDistribute">
            <div class="summary-report-table" ng-repeat="summaryReport in batchDistributionSummary.attributes">
                <h4>{{summaryReport.name}}</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="name-col">Group</th>
                            <th>Distributed</th>
                            <th>New</th>
                            <th>Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="indexerGroupReport in getSummaryReportsByGroup(summaryReport)">
                            <td class="name-col">{{indexerGroupReport.name}}</td>
                            <td>{{indexerGroupReport['today+distribute']}}</td>
                            <td>{{indexerGroupReport['this+reserve']}}</td>
                            <td>{{indexerGroupReport.cap}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th class="name-col">Total</th>
                            <th>{{summaryReport['today+distribute']}}</th>
                            <th>{{summaryReport['this+reserve']}}</th>
                            <th>{{getTotalCapForReport(summaryReport)}}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <div class="summary-report-detail-container" ng-if="!loadingDistributionSummary" ng-show="showMoreDetail">
            <div class="group-select-container">
                <h4>Group</h4>
                <select
                    class="form-control"
                    ng-model="selectedGroup"
                    ng-options="indexerGroup as indexerGroup.attributes.name for indexerGroup in indexerGroups">
                    <option value="">All</option>
                </select>
            </div>
            <div class="group-reports-container">
                <div class="group-report-table" ng-repeat="groupReport in batchDistributionSummary.attributes">
                    <h4>{{groupReport.name}}</h4>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th class="name-col" colspan="2">Priority</th>
                                <th>Totals</th>
                                <th>Late</th>
                                <th><2hrs</th>
                                <th>CC</th>
                                <th>HT</th>
                                <th>KL</th>
                                <th>CB</th>
                                <th>C1</th>
                                <th>C2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="name-col" colspan="2">Normal</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1'].total}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['urgency+late']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['urgency+near-deadline']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+3']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+4']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+1']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+2']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+5']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+1']['label+6']}}</td>
                            </tr>
                            <tr>
                                <td class="name-col" colspan="2">High</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2'].total}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['urgency+late']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['urgency+near-deadline']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+3']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+4']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+1']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+2']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+5']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+2']['label+6']}}</td>
                            </tr>
                            <tr>
                                <td class="name-col" colspan="2">Highest</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3'].total}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['urgency+late']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['urgency+near-deadline']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+3']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+4']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+1']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+2']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+5']}}</td>
                                <td>{{getDetailReportForGroup(selectedGroup, groupReport)['priority+3']['label+6']}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="name-col" colspan="2">Total</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'total')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'urgency+late')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'urgency+near-deadline')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+3')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+4')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+1')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+2')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+5')}}</th>
                                <th>{{getDetailTotalsForGroup(selectedGroup, groupReport, 'label+6')}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <button class="toggle-detail-btn btn btn-default" ng-click="showMoreDetail = !showMoreDetail" ng-hide="loadingDistributionSummary || noGamesToDistribute">
            <span ng-show="!showMoreDetail">View More</span>
            <span ng-show="showMoreDetail">View Less</span>
        </button>
    </div>

</div>

`;

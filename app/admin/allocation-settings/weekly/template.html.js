export default `
    <div class="weekly-allocation-settings">
        <form role="form" name="formSetting">
            <div class="week-select-container">
                <h4>Week</h4>
                <select class="form-control" ng-model="selectedWeek">
                    <option value="current">Current</option>
                    <option value="next">Next</option>
                </select>
            </div>

            <div class="weekly-allocation-wrapper">
                <div ng-repeat="(i, projection) in projections" ng-show="i >= startKey && i < startKey+7" class="weekly-allocation-div" ng-class="{'active': projection.isActive, 'inactive': !projection.isActive}">
                    <div class="weekly-allocation-header">
                        <div class="allocation-date">
                            {{projection.attributes.date|date : 'EEE, MMM d, y' : 'UTC'}} (GMT)
                        </div>
                        <div class="allocation-daily-total">
                            <span>Projected</span>
                            <span ng-if="!projection.isActive">
                                {{projection.attributes.projectedBreakdowns}}
                            </span>
                            <input type="text" ng-model="projection.attributes.projectedBreakdowns" ng-if="projection.isActive">
                        </div>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th class="group">Group</th>
                                <th class="percent">%</th>
                                <th class="allocation">Allocation</th>
                                <th class="cap">Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="weeklySetting in weeklyIndexingSettings[i].setting">
                                <td class="group">{{weeklySetting.attributes.indexerGroup}}</td>
                                <td class="percent">
                                    <span ng-if="!projection.isActive">{{weeklySetting.attributes.percentage}}</span>
                                    <input type="text" ng-model="weeklySetting.attributes.percentage" ng-if="projection.isActive" ng-change="checkPercentage(i)" min="0" max="100" integer>
                                </td>
                                <td class="allocation">{{projection.attributes.projectedBreakdowns * weeklySetting.attributes.percentage/100}}</td>
                                <td class="cap">
                                    <span ng-if="!projection.isActive">{{weeklySetting.attributes.cap}}</span>
                                    <input type="text" ng-model="weeklySetting.attributes.cap" ng-if="projection.isActive" integer>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="group">Total</th>
                                <th class="percent">
                                    {{Total(i, 'percentage')}}
                                </th>
                                <th class="allocation">{{Total(i, 'allocation')}}</th>
                                <th class="cap">{{Total(i, 'cap')}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <button id="save-weeklysetting-cta" class="btn btn-primary pull-right" ng-disabled="formSetting.$invalid || formSetting.$pristine" ng-click="saveSettings()">SAVE</button>
        </form>
    </div>
`;

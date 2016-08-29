export default `
    <div class="weekly-allocation-settings">
        <div class="week-select-container">
            <h4>Week</h4>
            <select class="form-control" ng-model="selectedWeek" ng-change="onChangeWeek(selectedWeek,'{{selectedWeek}}')">
                <option value="current">Current</option>
                <option value="next">Next</option>
            </select>
        </div>
        <form role="form" name="formSetting">
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
                            <tr ng-repeat="weeklySetting in weeklyIndexingSettings[i].setting" ng-class="{'disabled': !groupHasPermission(weeklySetting.attributes.indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                                <td class="group">
                                    {{weeklySetting.attributes.indexerGroup}}
                                </td>
                                <td class="percent">
                                    <span ng-if="!projection.isActive || !groupHasPermission(weeklySetting.attributes.indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)">
                                        {{weeklySetting.attributes.percentage}}
                                    </span>
                                    <input type="text" ng-model="weeklySetting.attributes.percentage" ng-if="projection.isActive && groupHasPermission(weeklySetting.attributes.indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)" ng-change="checkPercentage(i)" min="0" max="100" integer size="3" maxlength="3">
                                </td>
                                <td class="allocation">{{projection.attributes.projectedBreakdowns * weeklySetting.attributes.percentage/100|number: 0}}</td>
                                <td class="cap">
                                    <span ng-if="!projection.isActive || !groupHasPermission(weeklySetting.attributes.indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)">
                                        {{weeklySetting.attributes.cap}}
                                    </span>
                                    <input type="text" ng-model="weeklySetting.attributes.cap" ng-if="projection.isActive && groupHasPermission(weeklySetting.attributes.indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)" integer>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="group">Total</th>
                                <th class="percent">
                                    {{Total(i, 'percentage')}}<sup>*</sup>
                                    <input type="hidden" id="totalPercent-{{i}}" name="totalPercent-{{i}}"  ng-pattern="regex" ng-model="projection.percentage">
                                </th>
                                <th class="allocation">{{Total(i, 'allocation')}}</th>
                                <th class="cap">{{Total(i, 'cap')}}</th>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="setting-footer"><sup>*</sup>Allocation % must add up to 100</div>
                </div>
            </div>
            <button id="save-weeklysetting-cta" class="btn btn-primary pull-right" ng-disabled="formSetting.$invalid || formSetting.$pristine || preSaving" ng-click="saveSettings()" name="btnSave">
                <span ng-show="!preSaving">SAVE</span>
                <span ng-show="preSaving" class="icon icon-spinner spinner"></span>
            </button>
        </form>
    </div>
`;

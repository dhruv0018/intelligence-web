export default `
    <div class="general-allocation-settings">
        <div class="general-allocation-wrapper">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>{{ALLOCATION_TYPES.PRIORITY_NORMAL.display}}</th>
                        <th>{{ALLOCATION_TYPES.URGENCY_LATE.display}}</th>
                        <th>{{ALLOCATION_TYPES.URGENCY_NEAR_DEADLINE.display}}</th>
                        <th>{{ALLOCATION_TYPES.PRIORITY_HIGHEST.display}}</th>
                        <th>{{ALLOCATION_TYPES.PRIORITY_HIGH.display}}</th>
                        <th>{{ALLOCATION_TYPES.HYPER_TURNAROUND.display}}</th>
                        <th>{{ALLOCATION_TYPES.COACH_COMPLAINT.display}}</th>
                        <th>{{ALLOCATION_TYPES.KROSSOVER_LITE.display}}</th>
                        <th>{{ALLOCATION_TYPES.COACH_BREAKDOWN.display}}</th>
                        <th>{{ALLOCATION_TYPES.CUSTOM_1.display}}</th>
                        <th>{{ALLOCATION_TYPES.CUSTOM_2.display}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="indexerGroup in indexerGroups" ng-class="{'not-allowed': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                        <td>{{indexerGroup.attributes.name}}</td>
                        <td>
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)">
                            </check-box>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.URGENCY_LATE.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.URGENCY_LATE.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.URGENCY_NEAR_DEADLINE.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.URGENCY_NEAR_DEADLINE.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_HIGHEST.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_HIGHEST.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_HIGH.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_HIGH.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.HYPER_TURNAROUND.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.HYPER_TURNAROUND.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.COACH_COMPLAINT.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.COACH_COMPLAINT.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.KROSSOVER_LITE.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.KROSSOVER_LITE.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.COACH_BREAKDOWN.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.COACH_BREAKDOWN.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.CUSTOM_1.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.CUSTOM_1.id)">
                            </check-box>
                        </td>
                        <td ng-class="{'disabled': !groupHasPermission(indexerGroup, ALLOCATION_TYPES.PRIORITY_NORMAL.id)}">
                            <check-box
                                checked="groupHasPermission(indexerGroup, ALLOCATION_TYPES.CUSTOM_2.id)"
                                ng-click="toggleGroupPermission(indexerGroup, ALLOCATION_TYPES.CUSTOM_2.id)">
                            </check-box>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="btn btn-primary pull-right" ng-click="saveGroupPermissions()">SAVE</button>
    </div>
`;

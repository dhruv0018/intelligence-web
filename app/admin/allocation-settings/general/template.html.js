export default `
    <div class="general-allocation-settings">
        <div class="general-allocation-wrapper">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Group</th>
                        <th>Allowed</th>
                        <th>Late</th>
                        <th><2hrs</th>
                        <th>Coach Complaint</th>
                        <th>Hyper Turnaround</th>
                        <th>Highest Priority</th>
                        <th>High Priority</th>
                        <th>Krossover Lite</th>
                        <th>Coach Breakdown</th>
                        <th>Custom 1</th>
                        <th>Custom 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]">
                        <td>Us Marketplace</td>
                        <td>
                            <check-box
                                id="priority+1-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        <td>
                            <check-box
                                id="urgency+Late-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="urgency+near-deadline-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+1-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+2-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="priority+3-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="priority+2-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+3-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+4-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+5-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                        <td>
                            <check-box
                                id="label+6-cta"
                                checked="true"
                                ng-click="">
                            </check-box>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="btn btn-primary pull-right">SAVE</button>
    </div>
`;

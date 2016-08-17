export default `
    <div class="weekly-allocation-settings">
        <div class="week-select-container">
            <select class="form-control" ng-model="selectedWeek">
                <option value="current">Current Week</option>
                <option value="next">Next Week</option>
            </select>
        </div>

        <div class="weekly-allocation-wrapper">
            <div ng-repeat="i in [0, 1, 2, 3, 4, 5, 6]" class="weekly-allocation-div" ng-class="{'active' : i>4}">
                <div class="weekly-allocation-header">
                    <div class="allocation-date">
                        Mon, Jul 11, 2016
                    </div>
                    <div class="allocation-daily-total">
                        <span>Daily Total</span> 543
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Current</th>
                            <th>New</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="i in [0, 1, 2, 3, 4, 5, 6]">
                            <td>Sandcube</td>
                            <td>100</td>
                            <td>50</td>
                            <td>150</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th>100</th>
                            <th>50</th>
                            <th>150</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
`;

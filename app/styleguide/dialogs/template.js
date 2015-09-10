export default `

    <div class="dialogs">

        <h3> Generic Examples </h3>
        <p> TODO </p>

        <h3> Real Examples </h3>
        <h4> TODO: </h4>
        <ul style="color: red">
            <li>Refactor Dialogs that can't display without the data they need to function completely (i.e at least viewable)</li>
            <li>Add Basic Modal Examples</li>
        </ul>

        <table class="table">

            <tr>
                <th>Dialog Description</th>
                <th>Type</th>
                <th>Show</th>
                <th>Info</th>
            </tr>

            <tr ng-repeat="dialog in dialogs | orderBy: ['-enabled', 'name']">

                <td>
                    <span ng-if="dialog.enabled">{{ dialog.name }}</span>
                    <span ng-if="!dialog.enabled" style="color: red"><em>{{ dialog.name }}</em></span>
                </td>

                <td>{{dialog.type}}</td>

                <td>
                    <button ng-click="show($event, dialog)">Show</button>
                </td>

                <td>
                    <span ng-if="!dialog.enabled">(Not ready, needs refactor or dependencies)</span>
                </td>
            </tr>


        </ul>

    </div>
`;

export default `

    <div class="dialogs">

        <h3> Generic Examples </h3>

            <p> TODO </p>

        <h3> Real Examples </h3>

        <ul>

            <li ng-repeat="dialog in dialogs">
                <label> {{ dialog.name }} </label>
                <button ng-click="showDialog($event, $index)">Show</button>
            </li>


        </ul>

    </div>
`;

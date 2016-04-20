/**
 * @param {}
 */
const KrossoverConferenceSelectTemplate = () => `

    <md-select ng-model="selectedConferences" placeholder="Select an Association">
        <md-option ng-value="conference" ng-repeat="conference in confereces | filter:searchTerm">
                {{conference.conference}}
        </md-option>
    </md-select>
    <md-select ng-model="selectedConferences" placeholder="Select a Conference">
        <md-option ng-value="conference" ng-repeat="conference in confereces | filter:searchTerm">
                {{conference.conference}}
        </md-option>
    </md-select>
    <md-button ng-disabled="false">
        Add Conference
    </md-button>
    <md-list>
        <md-list-item class="md-list-item" ng-repeat="tconference in teamConferences">
            <span>{{tconference.conference}}</span>
            <span class="icon-times-circle" ng-click="delete(tconference)"></span>
        </md-list-item>
    </md-list>

`;

export default KrossoverConferenceSelectTemplate;

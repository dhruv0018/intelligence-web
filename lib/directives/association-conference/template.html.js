export default `

    <div class="association-conference">

        <div class="conference-info">
            <span>{{conference.code}}</span>

            <span ng-hide="isEditingConference">{{conference.name}}</span>
            <input class="form-control" ng-model="updatedConferenceName" ng-show="isEditingConference">

            <span ng-show="conference.competitionLevel && !isEditingConference">{{conference.competitionLevel}}</span>
            <select
                class="form-control"
                ng-show="isEditingConference"
                ng-model="updatedCompetitionLevel"
                ng-options="competitionLevel.code as competitionLevel.name for competitionLevel in competitionLevels">
                <option value="">No Competition Level</option>
            </select>

            <div>
                <i class="icon icon-pencil" ng-click="isEditingConference = true" ng-hide="isEditingConference"></i>
                <i class="icon icon-trash-o" ng-click="removeConference()" ng-hide="isEditingConference"></i>
                <button class="btn btn-primary" ng-show="isEditingConference" ng-click="updateConference(updatedConferenceName, updatedCompetitionLevel)">Save</button>
                <button class="btn btn-default" ng-show="isEditingConference" ng-click="isEditingConference = false">Cancel</button>
            </div>
        </div>

        <div class="conference-sports-container">
            <span>Add Sport</span>
        </div>

    </div>

`;

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
            <div class="add-new-sport">
                <span class="add-sport-btn" ng-hide="isAddingSport" ng-click="isAddingSport = true">Add Sport</span>
                <select class="form-control" ng-show="isAddingSport" ng-model="newConferenceSport.gender">
                    <option value="">Select Gender</option>
                    <option value="Male">Men's</option>
                    <option value="Female">Women's</option>
                    <option value="Coed">Coed</option>
                </select>
                <select class="form-control" ng-show="isAddingSport" ng-model="newConferenceSport.sportId" ng-options="sport.id as sport.name for sport in sports">
                    <option value="">Select Sport</option>
                </select>
                <div>
                    <button class="btn btn-sm btn-primary" ng-show="isAddingSport" ng-click="addConferenceSport(newConferenceSport)">Save</button>
                    <button class="btn btn-sm btn-default" ng-show="isAddingSport" ng-click="isAddingSport = false">Cancel</button>
                </div>
            </div>
            <association-conference-sport
                class="conference-sport"
                ng-repeat="conferenceSport in conferenceSports"
                conference-sport="conferenceSport">
            </association-conference-sport>
        </div>

    </div>

`;

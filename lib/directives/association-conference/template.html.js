export default `

    <div class="association-conference">
        <accordion-group is-open="status.open">
            <accordion-heading>
                <div class="conference-header">
                    <div class="conference-info">
                        <span>{{conference.code}}</span>
                    </div>

                    <div class="conference-info conference-info-name" ng-hide="isEditingConference">
                        <span>{{conference.name}}</span>
                    </div>

                    <div class="conference-info conference-info-name" ng-if="isEditingConference">
                        <input
                            class="form-control"
                            ng-click="onInputClick($event)"
                            ng-init="$parent.updatedConferenceName = conference.name"
                            ng-model="$parent.updatedConferenceName">
                    </div>

                    <div class="conference-info" ng-hide="isEditingConference">
                        <span>{{getCompetitionLevelName(conference.competitionLevel)}}</span>
                    </div>

                    <div class="conference-info" ng-if="isEditingConference">
                        <select
                            class="form-control"
                            ng-click="onInputClick($event)"
                            ng-init="$parent.updatedCompetitionLevel = conference.competitionLevel"
                            ng-model="$parent.updatedCompetitionLevel"
                            ng-options="competitionLevel.code as competitionLevel.name for competitionLevel in competitionLevels">
                            <option value="">No Competition Level</option>
                        </select>
                    </div>

                    <div>
                        <i class="icon icon-pencil" ng-click="onEditClick($event)" ng-hide="isEditingConference"></i>
                        <i class="icon icon-trash-o" ng-click="onDeleteClick($event)" ng-hide="isEditingConference"></i>
                        <button
                            class="btn btn-sm btn-primary"
                            ng-show="isEditingConference"
                            ng-click="onSaveClick($event, updatedConferenceName, updatedCompetitionLevel)"
                            ng-disabled="!updatedConferenceName.length">
                            Save
                        </button>
                        <button class="btn btn-sm btn-default" ng-show="isEditingConference" ng-click="onCancelClick($event)">Cancel</button>
                        <i class="icon" ng-class="{'icon-chevron-up': status.open, 'icon-chevron-down': !status.open}"></i>
                    </div>
                </div>
            </accordion-heading>
            <div class="conference-sports-container">
                <div class="add-new-sport">
                    <span class="add-sport-btn" ng-hide="isAddingSport" ng-click="onAddSportClick()" ng-class="{'disabled': isEditingConference}">Add Sport</span>
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
                        <button
                            class="btn btn-sm btn-primary"
                            ng-show="isAddingSport"
                            ng-click="addConferenceSport(newConferenceSport)"
                            ng-disabled="!newConferenceSport.gender || !newConferenceSport.sportId">
                            Add Sport
                        </button>
                        <button class="btn btn-sm btn-default" ng-show="isAddingSport" ng-click="onCancelAddingSportClick()">Cancel</button>
                    </div>
                </div>
                <association-conference-sport
                    class="conference-sport"
                    ng-repeat="conferenceSport in conferenceSports"
                    conference-sport="conferenceSport"
                    is-editing-conference="isEditingConference">
                </association-conference-sport>
            </div>
        </accordion-group>
    </div>

`;

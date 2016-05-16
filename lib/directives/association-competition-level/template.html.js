export default `

    <div class="association-competition-level">

        <span class="code-container">{{competitionLevel.code}}</span>

        <span ng-hide="isEditingCompetitionLevel">{{competitionLevel.name}}</span>
        <div class="edit-input" ng-show="isEditingCompetitionLevel">
            <input class="form-control" ng-model="updatedCompetitionLevelName">
        </div>

        <div class="action-buttons">
            <i class="icon icon-pencil" ng-click="isEditingCompetitionLevel = true" ng-hide="isEditingCompetitionLevel"></i>
            <i class="icon icon-trash-o" ng-click="removeCompetitionLevel()" ng-hide="isEditingCompetitionLevel"></i>
            <button class="btn btn-sm btn-primary" ng-show="isEditingCompetitionLevel" ng-click="updateCompetitionLevel(updatedCompetitionLevelName)">Save</button>
            <button class="btn btn-sm btn-default" ng-show="isEditingCompetitionLevel" ng-click="onCancelClick()">Cancel</button>
        </div>

    </div>

`;

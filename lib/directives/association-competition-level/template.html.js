export default `

    <div class="association-competition-level">

        <span ng-hide="isEditingCompetitionLevel">{{competitionLevel.name}}</span>
        <input class="form-control" ng-model="updatedCompetitionLevelName" ng-show="isEditingCompetitionLevel">

        <span>{{competitionLevel.code}}</span>

        <div>
            <i class="icon icon-pencil" ng-click="isEditingCompetitionLevel = true" ng-hide="isEditingCompetitionLevel"></i>
            <i class="icon icon-trash-o" ng-click="removeCompetitionLevel()" ng-hide="isEditingCompetitionLevel"></i>
            <button class="btn btn-primary" ng-show="isEditingCompetitionLevel" ng-click="updateCompetitionLevel(updatedCompetitionLevelName)">Save</button>
            <button class="btn btn-default" ng-show="isEditingCompetitionLevel" ng-click="isEditingCompetitionLevel = false">Cancel</button>
        </div>

    </div>

`;

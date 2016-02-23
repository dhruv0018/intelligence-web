FormationLabelController.$inject = [
    '$scope',
    'FormationLabelsFactory',
    'KEYBOARD_CODES'
];

function FormationLabelController (
    $scope,
    formationLabelsFactory,
    KEYBOARD_CODES
) {
    $scope.isEditingLabel = false;
    let formationLabelCopy = angular.copy($scope.formationLabel);
    let formationLabelObj;
    let teamId = $scope.teamId;
    let seasonId = $scope.seasonId;
    let bfFormationId = Number($scope.formation.backfieldFormationId);
    let lfFormationId = Number($scope.formation.leftFlankFormationId);
    let rfFormationId = Number($scope.formation.rightFlankFormationId);

    $scope.onEditClick = function(event) {
        bypassAccordionToggle(event);
        $scope.isEditingLabel = true;
    };

    $scope.onInputClick = function(event) {
        bypassAccordionToggle(event);
    };

    $scope.onCancelClick = function(event) {
        bypassAccordionToggle(event);
        cancelEditing();
    };

    $scope.onSaveClick = function(event) {
        bypassAccordionToggle(event);
        saveFormationLabel();
    };

    $scope.onKeyPress = function(keyEvent) {
        if (keyEvent.which === KEYBOARD_CODES.ENTER) {
            saveFormationLabel();
        } else if (keyEvent.which === KEYBOARD_CODES.ESC) {
            cancelEditing();
        }
    };

    function bypassAccordionToggle(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function saveFormationLabel() {
        if(!$scope.formation.labelId) {
            createFormationLabel($scope.formationLabel);
        } else {
            updateFormationLabel($scope.formationLabel);
        }
    }

    function cancelEditing() {
        $scope.formationLabel = formationLabelCopy;
        $scope.isEditingLabel = false;
    }

    function finishEditing() {
        formationLabelCopy = $scope.formationLabel;
        $scope.isEditingLabel = false;
    }

    function createFormationLabel(label) {

        formationLabelObj = formationLabelsFactory.create({
            label,
            teamId,
            seasonId: 1,
            bfFormationId,
            lfFormationId,
            rfFormationId
        });
        $scope.formation.label = label;
        formationLabelObj.save().then(response => {
            if(!response.errorCode) {
                $scope.formation.labelId = response.id;
                finishEditing();
            }
        });
    }

    function updateFormationLabel(label) {

        formationLabelObj = formationLabelsFactory.extend({
            label,
            id: $scope.formation.labelId,
            teamId,
            seasonId: 1,
            bfFormationId,
            lfFormationId,
            rfFormationId
        });

        if (!label.length) {
            formationLabelObj.delete().then(response => {
                if(!response.errorCode) finishEditing();
            });
        } else {
            formationLabelObj.save().then(response => {
                if(!response.errorCode) finishEditing();
            });
        }
    }
}

export default FormationLabelController;

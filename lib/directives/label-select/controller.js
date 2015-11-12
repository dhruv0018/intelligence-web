const dependencies = [
    '$scope',
    'LABELS'
];

/**
 * @param {Object} $scope - Angular $scope
 */
const KrossoverLabelSelectController = (
    $scope,
    LABELS
) => {

    $scope.LABELS = LABELS;
};

KrossoverLabelSelectController.$inject = dependencies;

export default KrossoverLabelSelectController;

const KrossoverTeamLabelIconLink = (
    $scope,
    element,
    attributes
) => {

    if (attributes.tooltip === 'false') {

        /**
         * Default behavior includes tooltip.
         * Explicitly declare tooltip="false"
         * to disable.
         */
        element.css('pointer-events', 'none');
    } else {

        $scope.tooltip = true;
    }
};

export default KrossoverTeamLabelIconLink;

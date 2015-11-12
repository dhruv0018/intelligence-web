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
         *
         * This prevents the onHover callback
         * that initiates the tooltip, where
         * ngIf fails
         */
        element.css('pointer-events', 'none');
    } else {

        $scope.tooltip = true;
    }
};

export default KrossoverTeamLabelIconLink;

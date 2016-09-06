const angular = window.angular;

/**
 * RunDistribution Service
 * @module RunDistribution
 * @name RunDistribution.Service
 * @type {Service}
 */

RunDistributionModel.$inject = [
    '$modal',
    'RunDistribution.ModalOptions'
];

function RunDistributionModel(
    $modal,
    $modalOptions
) {

    const definition = {

        open: function() {
            var resolves = {
                resolve: {}
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        }

    };


    return definition;
}

export default RunDistributionModel;

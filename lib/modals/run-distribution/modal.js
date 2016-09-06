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
                resolve: {
                    batchID: ()=> {
                        return (typeof arguments[0] == "number") ? arguments[0]: null;
                    }
                }
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        }

    };


    return definition;
}

export default RunDistributionModel;

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

        open: function(indexerGroups) {
            var resolves = {
                resolve: {
                    batchID: ()=> {
                        return (typeof arguments[1] == "number") ? arguments[1]: null;
                    },
                    IndexerGroups: () => indexerGroups
                }
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        }

    };


    return definition;
}

export default RunDistributionModel;

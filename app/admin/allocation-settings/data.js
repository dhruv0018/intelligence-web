/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsDataDependencies.$inject = [
    '$q',
    'SportsFactory',
    'IndexerFactory',
    'SessionService'
];

function AllocationSettingsDataDependencies (
    $q,
    sports,
    indexerFactory,
    session
) {

    class AllocationSettingsData {

        constructor () {
            /* Load data. */
            this.sports = sports.load();
            this.indexerGroupAllocationTypes = indexerFactory.getIndexerGroupAllocationTypes();
        }
    }

    return AllocationSettingsData;
}

export default AllocationSettingsDataDependencies;

/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsDataDependencies.$inject = [
    '$q',
    'SportsFactory',
    'IndexerFactory',
    'SPORTS'
];

function AllocationSettingsDataDependencies (
    $q,
    sports,
    indexerFactory,
    SPORTS
) {

    class AllocationSettingsData {

        constructor () {
            /* Load data. */
            this.sports = sports.load();
            this.indexerGroups = indexerFactory.getIndexerGroups();
            this.indexerGroupAllocationTypes = indexerFactory.getIndexerGroupAllocationTypes();
            this.indexerGroupsAllocationPermissions = indexerFactory.getIndexerGroupsAllocationPermissions(SPORTS.BASKETBALL.id);
        }
    }

    return AllocationSettingsData;
}

export default AllocationSettingsDataDependencies;

/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsDataDependencies.$inject = [
    '$q',
    'SportsFactory',
    'SessionService'
];

function AllocationSettingsDataDependencies (
    $q,
    sports,
    session
) {

    class AllocationSettingsData {

        constructor () {
            /* Load data. */
            this.sports = sports.load();
        }
    }

    return AllocationSettingsData;
}

export default AllocationSettingsDataDependencies;

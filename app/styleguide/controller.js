StyleguideController.$inject = [
    '$scope',
    '$timeout',
    'config'
];

function StyleguideController (
    $scope,
    $timeout,
    config
) {
    $scope.config = config;

    $scope.$on('$viewContentLoaded', function() {
        $scope.slideMenuActive = false;
        // Logic for sidebar dropdown toggles
        let dropdownElements = document.getElementsByClassName('nav-dropdown-toggle');
        dropdownElements = [].slice.call(dropdownElements); //Convert HTMLCollection to array
        dropdownElements.forEach(dropdownElement => {
            let dropdownContainer = [].slice.call(dropdownElement.children)[0];
            let childLinks = [].slice.call(dropdownContainer.children);
            let hasActiveChild = childLinks.some(childLink => {
                return childLink.classList.contains('active');
            });

            if (hasActiveChild) {
                dropdownElement.classList.add('expanded');
            }
        });
    });

    $scope.toggleDropdown = function($event) {
        let srcElement = $event.srcElement;
        srcElement.classList.toggle('expanded');
    };

    $scope.copyCodeConfirm = function($event) {
        let srcElement = $event.srcElement;
        srcElement.classList.add('primary-action-btn');
        srcElement.innerHTML = 'Copied!';
        $timeout(function() {
            srcElement.classList.remove('primary-action-btn');
            srcElement.innerHTML = 'Copy Code';
        }, 1200);
    };
}

export default StyleguideController;

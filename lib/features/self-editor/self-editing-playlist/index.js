const angular = window.angular;

/* Module Imports */
import template from './template.html';
import directive from './directive';

const templateUrl = 'self-editing-playlist/template.html';
const SelfEditingPlaylist = angular.module('SelfEditingPlaylist', []);

SelfEditingPlaylist.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

SelfEditingPlaylist.directive('selfEditingPlaylist', directive);

export default SelfEditingPlaylist;

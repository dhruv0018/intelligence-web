const angular = window.angular;

import directive from './directive';

const SelfEditingPlaylist = angular.module('SelfEditingPlaylist', []);

SelfEditingPlaylist.directive('selfEditingPlaylist', directive);

export default SelfEditingPlaylist;

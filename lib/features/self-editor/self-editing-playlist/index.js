const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditingPlaylist = angular.module('SelfEditingPlaylist', []);

SelfEditingPlaylist.directive('selfEditingPlaylist', directive);

export default SelfEditingPlaylist;

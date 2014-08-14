var Videogular = angular.module('Videogular', [
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.poster'
]);

require('./buffering');
require('./controls');
require('./overlay-play');
require('./poster');
require('./videogular');

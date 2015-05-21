const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('DetectDeviceService', function() {

    const isAndroid = () => /Android/i.test(navigator.userAgent);
    const isBlackBerry = () => /BlackBerry/i.test(navigator.userAgent);
    const isiOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isiPhone = () => /iPhone/i.test(navigator.userAgent);
    const isiPad = () => /iPad/i.test(navigator.userAgent);
    const isiPod = () => /iPod/i.test(navigator.userAgent);
    const isWindows = () => /IEMobile/i.test(navigator.userAgent);

    const service = {

        Android: isAndroid,

        BlackBerry: isBlackBerry,

        iOS: isiOS,

        iPhone: isiPhone,

        iPad: isiPad,

        iPod: isiPod,

        Windows: isWindows,

        mobile: () => isAndroid() || isBlackBerry() || isiOS() || isWindows(),

        getDevice: () => navigator.userAgent
    };

    return service;
});

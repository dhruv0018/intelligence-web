const angular = window.angular;

import directive from './directive';
import TELESTRATIONS_CONSTANTS from './constants';

import TelestrationControls from './telestration-controls';
import GlyphEditor from './glyph-editor';
import Glyph from './glyph';

const Telestrations = angular.module('Telestrations', [
    'TelestrationControls',
    'GlyphEditor',
    'Glyph'
]);

// Directives
Telestrations.directive('telestrations', directive);

// Constants
Telestrations.value('TELESTRATIONS_CONSTANTS', TELESTRATIONS_CONSTANTS);

// Controller API
Telestrations.value('Telestrations', {});

export default Telestrations;

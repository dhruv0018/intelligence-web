import { PlayerFieldDefinition, fieldTemplate } from './directive';

const Player = angular.module('Field.Player', []);

Player.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);

Player.directive('playerField', () => new PlayerFieldDefinition());

export default Player;
